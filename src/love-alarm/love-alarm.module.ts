import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoveAlarmController } from './love-alarm.controller';
import { LoveAlarmService } from './love-alarm.service';
import { User } from '../user/entities/user.entity';
import { LocationModule } from '../location/location.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), LocationModule, UserModule],
  controllers: [LoveAlarmController],
  providers: [LoveAlarmService],
})
export class LoveAlarmModule {}
