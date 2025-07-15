import { Controller, Post, Body } from '@nestjs/common';
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
  async getLoveAlarmCount(
    @Body() loveAlarmDto: LoveAlarmDto,
  ): Promise<{ count: number }> {
    return this.loveAlarmService.getLoveAlarmCount(
      loveAlarmDto.userId,
      loveAlarmDto.latitude,
      loveAlarmDto.longitude,
    );
  }
}
