// src/location/location.controller.ts

import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LocationService } from './location.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

// 위치 데이터를 받을 때 사용할 DTO (Data Transfer Object)
class LocationDto {
  latitude: number;
  longitude: number;
  userId?: number; // Optional: Can be used to specify a user
}

@Controller('location')
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private readonly userService: UserService,
  ) {}

  // POST /location
  // 클라이언트로부터 위치 정보를 받아서 저장합니다.
  @Post()
  async addLocation(@Body() locationDto: LocationDto): Promise<void> {
    let user;

    if (locationDto.userId) {
      // If userId is provided, find that user.
      user = await this.userService.findOne(locationDto.userId);
    } else {
      // For testing, we'll find or create a user if no userId is provided.
      // In a real app, this would come from authentication.
      const userDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        age: 20,
        class: 1,
        profileEmoji: '',
        comment: '',
      };
      user = await this.userService.findOrCreateUser(userDto);
    }

    return this.locationService.addLocation(
      user,
      locationDto.latitude,
      locationDto.longitude,
    );
  }

  // GET /location/path/:userId
  // 특정 사용자의 이동 경로를 조회합니다.
  @Get('path/:userId')
  getPath(@Param('userId', ParseIntPipe) userId: number) {
    return this.locationService.getPath(userId);
  }
}
