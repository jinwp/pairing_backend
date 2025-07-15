import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { Chatroom } from './chatroom/entities/chatroom.entity';
import { Message } from './message/entities/message.entity';
import { ChatroomModule } from './chatroom/chatroom.module';
import { MessageModule } from './message/message.module';
import { LocationModule } from './location/location.module';
import { RedisModule } from './redis/redis.module';
import { Location } from './location/entities/location.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'pairing_user',
      password: '3775yahj@',
      database: 'pairing_db',
      entities: [User, Chatroom, Message, Location],
      synchronize: false,
    }),
    UserModule,
    ChatroomModule,
    MessageModule,
    LocationModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
