import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { LoveAlarmService } from '../love-alarm/love-alarm.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');

  constructor(private readonly loveAlarmService: LoveAlarmService) {}

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    const { userId, chatroomId } = client.handshake.query;
    if (userId) {
      client.join(String(userId));
    }
    if (chatroomId) {
      client.join(String(chatroomId));
    }
  }

  @SubscribeMessage('checkForMatch')
  async handleCheckForMatch(client: Socket, userId: number) {
    this.logger.log(`Checking for match for user: ${userId}`);
    const match = await this.loveAlarmService.checkForMatch(userId);
    if (match) {
      this.logger.log(`Match found for user: ${userId}, match: ${JSON.stringify(match)}`);
      this.server.to(String(userId)).emit('matchFound', match);
      this.server.to(String(match.user2.id)).emit('matchFound', match);
    }
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(client: Socket, message: any): void {
    this.server.to(String(message.chatroomId)).emit('newMessage', message);
  }
}
