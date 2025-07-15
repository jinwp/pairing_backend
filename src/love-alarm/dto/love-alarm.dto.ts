import { ApiProperty } from '@nestjs/swagger';

export class LoveAlarmDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the User',
    required: true,
  })
  userId: number;

  @ApiProperty({
    example: 37.5665,
    description: 'The latitude of the User',
    required: true,
  })
  latitude: number;

  @ApiProperty({
    example: 126.978,
    description: 'The longitude of the User',
    required: true,
  })
  longitude: number;
}
