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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string): void {
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
    // Notify the client that they have joined the room.
    client.emit('joinedRoom', room);
    // Notify other clients in the room.
    client.to(room).emit('userJoined', { userId: client.id });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string): void {
    client.leave(room);
    this.logger.log(`Client ${client.id} left room: ${room}`);
    client.to(room).emit('userLeft', { userId: client.id });
  }

  @SubscribeMessage('chatMessage')
  handleChatMessage(client: Socket, payload: { room: string; message: string; }): void {
    // Broadcast the message to all clients in the room, including the sender.
    this.server.to(payload.room).emit('chatMessage', {
      user: client.id, // In a real app, you'd use a user ID from auth.
      message: payload.message,
    });
  }
}
