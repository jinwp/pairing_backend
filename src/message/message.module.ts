import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';
import { Chatroom } from '../chatroom/entities/chatroom.entity';
import { UserModule } from '../user/user.module';
import { ChatroomModule } from '../chatroom/chatroom.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User, Chatroom]),
    UserModule,
    ChatroomModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
