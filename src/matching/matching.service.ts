import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { ChatroomService } from '../chatroom/chatroom.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly chatroomService: ChatroomService,
  ) {}

  @Cron('* * * * *') // Runs every minute
  async checkForMatches() {
    const users = await this.userRepository.find();
    const usersWithLove = users.filter(u => u.love !== 0);

    for (const user of usersWithLove) {
      const lovedUser = await this.userRepository.findOne({ where: { id: user.love } });
      if (lovedUser && lovedUser.love === user.id) {
        // Match found!
        const existingChatroom = await this.chatroomService.findByUserIds(user.id, lovedUser.id);

        if (!existingChatroom) {
          await this.chatroomService.create({
            user1Id: user.id,
            user2Id: lovedUser.id,
          });
        }
      }
    }
  }
}
