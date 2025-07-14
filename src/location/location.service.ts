// src/location/location.service.ts

import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { Point } from 'geojson';
import { Location } from './entities/location.entity';
import { User } from '../user/entities/user.entity';
import { REDIS_CLIENT } from '../redis/redis.module';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  // 새로운 위치 데이터를 추가하는 메서드
  async addLocation(
    user: User,
    latitude: number,
    longitude: number,
  ): Promise<void> {
    // 1. Redis에 현재 위치 저장 (실시간용)
    // 키는 'user:123:location'과 같은 형태가 됩니다.
    // 값은 JSON 문자열 형태로 위도, 경도를 저장합니다.
    // 1시간(3600초) 후에 자동으로 데이터가 사라지도록 설정(EX)할 수도 있습니다.
    const redisKey = `user:${user.id}:location`;
    const redisValue = JSON.stringify({ latitude, longitude });
    await this.redis.set(redisKey, redisValue, 'EX', 3600);

    // 2. PostGIS에 위치 데이터 저장 (경로 기록용)
    // GeoJSON 표준에 맞는 Point 객체를 생성합니다.
    const point: Point = {
      type: 'Point',
      coordinates: [longitude, latitude], // 경도, 위도 순서로 넣어야 합니다.
    };

    // 새로운 Location 엔티티를 생성하고 저장합니다.
    const newLocation = this.locationRepository.create({
      user,
      point,
    });
    await this.locationRepository.save(newLocation);
  }

  // 특정 사용자의 이동 경로를 가져오는 메서드 (예시)
  async getPath(userId: number): Promise<any[]> {
    const locations = await this.locationRepository.find({
      where: { user: { id: userId } },
      relations: ['user'], // 'user' 관계를 함께 로드합니다.
      order: { timestamp: 'ASC' }, // 시간 순으로 정렬
    });

    // 응답 데이터를 원하는 형태로 가공합니다.
    return locations.map((location) => ({
      id: location.id,
      point: location.point,
      timestamp: location.timestamp,
      userId: location.user.id, // user 객체에서 id만 추출하여 추가합니다.
    }));
  }
}
