import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    // 1. Location 엔티티를 TypeORM이 인식하도록 등록합니다.
    TypeOrmModule.forFeature([Location]),
    // 2. RedisModule을 import해서 Redis 클라이언트를 사용할 수 있게 합니다.
    RedisModule,
    // 3. UserModule을 import해서 UserService를 사용할 수 있게 합니다.
    UserModule,
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
