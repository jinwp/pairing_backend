import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { LocationService } from '../location/location.service';
import { UserService } from '../user/user.service';
import { ChatroomService } from '../chatroom/chatroom.service';
import { Chatroom } from 'src/chatroom/entities/chatroom.entity';

@Injectable()
export class LoveAlarmService {
  constructor(
    private readonly locationService: LocationService,
    private readonly userService: UserService,
    private readonly chatroomService: ChatroomService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async checkForMatch(userId: number): Promise<Chatroom | null> {
    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['love'],
    });

    if (!currentUser || !currentUser.love) {
      return null;
    }

    const lovedUser = await this.userRepository.findOne({
      where: { id: currentUser.love.id },
      relations: ['love'],
    });

    if (lovedUser && lovedUser.love && lovedUser.love.id === currentUser.id) {
      if (currentUser.id === lovedUser.id) {
        return null;
      }
      // Mutual love detected, create a chatroom
      const userIds = [currentUser.id, lovedUser.id].sort();
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
      const existingChatroom = await this.chatroomService.findByUserIds(
        userIds[0],
        userIds[1],
      );
      if (existingChatroom) {
        return existingChatroom;
      }
      const chatroom = await this.chatroomService.create({
        user1Id: userIds[0],
        user2Id: userIds[1],
      });
      return chatroom;
    }

    return null;
  }

  async getLoveAlarmCount(
    userId: number,
    latitude: number,
    longitude: number,
  ): Promise<{ count: number }> {
    // 1. Find the current user
    const currentUser = await this.userService.findOne(userId);
    if (!currentUser) {
      // Or handle as an error
      return { count: 0 };
    }

    // 2. Update the user's location
    await this.locationService.addLocation(currentUser, latitude, longitude);

    // 3. Find users who love the current user and are within a 5m radius
    // The radius is in meters.
    const radius = 5;
    const point = `POINT(${longitude} ${latitude})`;

    // This query finds users whose 'love' column matches the current user's ID
    // and whose latest location is within the specified radius.
    const query = `
      SELECT COUNT(DISTINCT u.id) as count
      FROM users u
      INNER JOIN (
          SELECT "userId", MAX(timestamp) as max_timestamp
          FROM location
          GROUP BY "userId"
      ) l_latest ON u.id = l_latest."userId"
      INNER JOIN location l ON l_latest."userId" = l."userId" AND l_latest.max_timestamp = l.timestamp
      WHERE u."loveId" = $1
      AND ST_DWithin(l.point, ST_GeomFromText($2, 4326), $3);
    `;

    const result = await this.userRepository.query(query, [
      userId,
      point,
      radius,
    ]);

    return { count: parseInt(result[0]?.count, 10) || 0 };
  }
}
