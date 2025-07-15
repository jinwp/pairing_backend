import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

// @apiProperty 데코레이터를 사용하여 Swagger 문서화
// 각 필드에 대한 설명과 예시를 추가
/// `required: true`: 필수 입력 힝목
  @ApiProperty({
    example: 1234567890,
    description: 'The Kakao ID of the User',
    required: false,
  })
  kakaoId?: number;

  @ApiProperty({
    example: 'test@example.com',
    description: 'The email of the User',
    required: false,
  })
  email?: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the User',
    required: true,
  })
  password?: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the User',
    required: true,
  })
  password?: string;

  @ApiProperty({
    example: 'testuser',
    description: 'The username of the User',
    required: true,
  })
  username: string;

  @ApiProperty({ example: 25, description: 'The age of the User', required: false })
  age?: number;

  @ApiProperty({ example: 1, description: 'The class of the User', required: false })
  class?: number;

  @ApiProperty({
    example: '😊',
    description: 'The profile emoji of the User',
    required: false,
  })
  profileEmoji?: string;

  @ApiProperty({
    example: 'Hello, world!',
    description: 'A comment from the User',
    required: false,
  })
  comment?: string;

  @ApiProperty({
    example: 'http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6K4K/img_640x640.jpg',
    description: 'The profile image URL of the User',
    required: false,
  })
  profileImage?: string;

  @ApiProperty({
    example: 10,
    description: 'The lover id of the User',
    required: false,
    default: 0,
  })
  love?: number; // Optional field
}
