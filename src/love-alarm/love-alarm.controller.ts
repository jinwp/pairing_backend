import { Controller, Post, Body, Get, Query, ParseIntPipe, ParseFloatPipe } from '@nestjs/common';
import { LoveAlarmService } from './love-alarm.service';
import { LoveAlarmDto } from './dto/love-alarm.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('love-alarm')
@Controller('love-alarm')
export class LoveAlarmController {
  constructor(private readonly loveAlarmService: LoveAlarmService) {}

  @Post()
  @ApiOperation({
    summary: 'Get the count of users who love you within a certain radius',
  })

  // async getLoveAlarmCount(
  //   @Body() loveAlarmDto: LoveAlarmDto,
  // ): Promise<{ count: number }> {
  //   return this.loveAlarmService.getLoveAlarmCount(
  //     loveAlarmDto.userId,
  //     loveAlarmDto.latitude,
  //     loveAlarmDto.longitude,
  //   );
  // }
  @Get('count')
    getCrushCount(
      @Query('userId', ParseIntPipe) userId: number,
      @Query('lat', ParseFloatPipe) lat: number,
      @Query('lon', ParseFloatPipe) lon: number,
    ) {
      return this.loveAlarmService.getCrushCount(userId, lat, lon)
              .then(crushCount => ({ crushCount }));
    }
}
