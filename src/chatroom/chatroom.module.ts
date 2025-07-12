import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatroom } from './entities/chatroom.entity';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chatroom, User]), UserModule],
  controllers: [ChatroomController],
  providers: [ChatroomService],
})
export class ChatroomModule {}
