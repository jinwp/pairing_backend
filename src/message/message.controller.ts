import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Send a new message', description: '새로운 메시지를 전송합니다.' })
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get('chatroom/:chatroomId')
  @ApiOperation({ summary: 'Get all messages in a chatroom', description: '특정 채팅방의 모든 메시지를 조회합니다.' })
  @ApiParam({ name: 'chatroomId', description: 'The ID of the chatroom', type: Number })
  findAll(@Param('chatroomId') chatroomId: string) {
    return this.messageService.findAllByChatroom(+chatroomId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message', description: 'ID로 특정 메시지를 삭제합니다.' })
  @ApiParam({ name: 'id', description: 'The ID of the message', type: String })
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
}
