import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'The email of the User',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the User',
    required: true,
  })
  password: string;
}
