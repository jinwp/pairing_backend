import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';
import { Chatroom } from '../chatroom/entities/chatroom.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Chatroom)
    private readonly chatroomRepository: Repository<Chatroom>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const { chatroomId, senderId, message } = createMessageDto;

    const chatroom = await this.chatroomRepository.findOne({ where: { id: chatroomId } });
    if (!chatroom) {
      throw new NotFoundException(`Chatroom with ID #${chatroomId} not found`);
    }

    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    if (!sender) {
      throw new NotFoundException(`Sender with ID #${senderId} not found`);
    }

    const newMessage = this.messageRepository.create({
      chatroom,
      sender,
      message,
    });

    const savedMessage = await this.messageRepository.save(newMessage);
    const messageWithSender = await this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['sender'],
    });
    if (!messageWithSender) {
      throw new NotFoundException(`Message with ID #${savedMessage.id} not found after creation`);
    }
    return messageWithSender;
  }

  async findAllByChatroom(chatroomId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { chatroom: { id: chatroomId } },
      relations: ['sender'],
      order: { created_at: 'ASC' },
    });
  }

  // 단일 메시지를 찾는 기능은 보통 필요하지 않으므로 비워둡니다.
  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  // 메시지 수정 기능은 보통 구현하지 않으므로 비워둡니다.
  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  async remove(id: string): Promise<void> {
    const result = await this.messageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Message with ID #${id} not found`);
    }
  }
}
