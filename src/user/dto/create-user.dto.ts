import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

// @apiProperty 데코레이터를 사용하여 Swagger 문서화
// 각 필드에 대한 설명과 예시를 추가
/// `required: true`: 필수 입력 힝목
  @ApiProperty({
    example: 'test@example.com',
    description: 'The email of the User',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'testuser',
    description: 'The username of the User',
    required: true,
  })
  username: string;

  @ApiProperty({ example: 25, description: 'The age of the User' })
  age: number;

  @ApiProperty({ example: 1, description: 'The class of the User' })
  class: number;

  @ApiProperty({
    example: '😊',
    description: 'The profile emoji of the User',
    required: false,
  })
  profileEmoji: string;

  @ApiProperty({
    example: 'Hello, world!',
    description: 'A comment from the User',
    required: false,
  })
  comment: string;

  @ApiProperty({
    example: 10,
    description: 'The lover id of the User',
    required: false,
    default: 0,
  })
  love?: number; // Optional field
}
