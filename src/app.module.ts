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
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { Location } from './location/entities/location.entity';
import { LoveAlarmModule } from './love-alarm/love-alarm.module';
import { EventsGateway } from './events/events.gateway';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        
        const dbConfig: any = {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [User, Chatroom, Message, Location],
          synchronize: !isProduction,
          dropSchema: !isProduction,
        };

        if (isProduction) {
          delete dbConfig.host;
          delete dbConfig.port;
          dbConfig.socketPath = `/cloudsql/${configService.get<string>('DB_HOST')}`;
        }

        return dbConfig;
      },
      inject: [ConfigService],
    }),
    UserModule,
    ChatroomModule,
    MessageModule,
    LocationModule,
    RedisModule,
    AuthModule,
    LoveAlarmModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
