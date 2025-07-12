import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'The ID of the chatroom this message belongs to',
    example: 1,
  })
  chatroomId: number;

  @ApiProperty({
    description: 'The ID of the user sending the message',
    example: 1,
  })
  senderId: number;

  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello, how are you?',
  })
  message: string;
}
