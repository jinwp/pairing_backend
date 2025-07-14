import { Module } from '@nestjs/common';
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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
<<<<<<< HEAD
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'pairing_user',
      password: '3775yahj@',
      database: 'pairing_db',
      entities: [User, Chatroom, Message, Location],
      synchronize: false,
=======
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
          entities: [User, Chatroom, Message],
          synchronize: !isProduction,
        };

        if (isProduction) {
          delete dbConfig.host;
          delete dbConfig.port;
          dbConfig.socketPath = `/cloudsql/${configService.get<string>('DB_HOST')}`;
        }

        return dbConfig;
      },
      inject: [ConfigService],
>>>>>>> 095fc1f (add cloudbild.yaml)
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
