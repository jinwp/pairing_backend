import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { LocationService } from '../location/location.service';
import { UserService } from '../user/user.service';

@Injectable()
export class LoveAlarmService {
  constructor(
    private readonly locationService: LocationService,
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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
      WHERE u.love = $1
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
