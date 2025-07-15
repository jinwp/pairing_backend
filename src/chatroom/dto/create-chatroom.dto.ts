import { ApiProperty } from '@nestjs/swagger';

export class CreateChatroomDto {
  @ApiProperty({
    description: 'The name of the chatroom',
    example: 'userA & userB',
  })
  name: string;

  @ApiProperty({
    description: 'The ID of the first user in the chatroom',
    example: 1,
  })
  user1Id: number;

  @ApiProperty({
    description: 'The ID of the second user in the chatroom',
    example: 2,
  })
  user2Id: number;
}
