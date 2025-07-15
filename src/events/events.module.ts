import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { LoveAlarmModule } from '../love-alarm/love-alarm.module';

@Module({
  imports: [LoveAlarmModule],
  providers: [EventsGateway],
})
export class EventsModule {}
