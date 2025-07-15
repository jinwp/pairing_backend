import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { Chatroom } from './entities/chatroom.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectRepository(Chatroom)
    private readonly chatroomRepository: Repository<Chatroom>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createChatroomDto: CreateChatroomDto): Promise<Chatroom> {
    const { user1Id, user2Id } = createChatroomDto;

    // 1. 두 사용자가 실제로 존재하는지 확인합니다.
    const user1 = await this.userRepository.findOne({ where: { id: user1Id } });
    const user2 = await this.userRepository.findOne({ where: { id: user2Id } });

    if (!user1 || !user2) {
      throw new NotFoundException('One or both users not found');
    }

    // 2. 새로운 채팅방 객체를 만듭니다.
    const newChatroom = this.chatroomRepository.create({
      user1,
      user2,
    });

    // 3. 데이터베이스에 저장하고 결과를 반환합니다.
    return this.chatroomRepository.save(newChatroom);
  }

  async findAll(): Promise<Chatroom[]> {
    // 모든 채팅방을 참여한 사용자 정보와 함께 반환합니다.
    return this.chatroomRepository.find({ relations: ['user1', 'user2'] });
  }

  // 특정 ID의 채팅방의 user 정보를 포함하여 반환합니다.
  async findOne(id: number): Promise<Chatroom> {
    const chatroom = await this.chatroomRepository.findOne({
      where: { id },
      relations: ['user1', 'user2'],
    });
    if (!chatroom) {
      throw new NotFoundException(`Chatroom with ID #${id} not found`);
    }
    return chatroom;
  }

  // Chatroom 정보 자체를 업데이트할 일은 거의 없으므로 update 메소드는 비워둡니다.
  update(id: number, updateChatroomDto: UpdateChatroomDto) {
    return `This action doesn't do anything.`;
  }

  async remove(id: number): Promise<void> {
    const result = await this.chatroomRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Chatroom with ID #${id} not found`);
    }
  }

  @Cron('0 * * * *') // Runs every hour
  async handleCron() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const expiredChatrooms = await this.chatroomRepository
      .createQueryBuilder('chatroom')
      .where('chatroom.created_at < :date', { date: twentyFourHoursAgo })
      .getMany();

    for (const chatroom of expiredChatrooms) {
      await this.chatroomRepository.remove(chatroom);
    }
  }
}
