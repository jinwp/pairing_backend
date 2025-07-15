import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { User } from '../user/entities/user.entity';
import { Chatroom } from '../chatroom/entities/chatroom.entity';
import { ChatroomModule } from '../chatroom/chatroom.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chatroom]), ChatroomModule],
  providers: [MatchingService],
  controllers: [MatchingController],
})
export class MatchingModule {}
