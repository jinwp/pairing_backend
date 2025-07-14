// src/redis/redis.module.ts

import { Module } from '@nestjs/common';
import Redis from 'ioredis';

// Redis 클라이언트를 다른 곳에서 주입해서 사용할 수 있도록 키를 정의합니다.
export const REDIS_CLIENT = 'REDIS_CLIENT';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        // Redis 서버에 접속하는 클라이언트를 생성합니다.
        // .env 파일 등을 통해 설정을 동적으로 바꿀 수도 있습니다.
        return new Redis({
          host: 'localhost',
          port: 6379,
        });
      },
    },
  ],
  // 이 모듈에서 제공하는 provider를 다른 모듈에서도 사용할 수 있도록 exports에 추가합니다.
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
