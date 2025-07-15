import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { love, ...rest } = createUserDto;
    const user = this.userRepository.create(rest);
    if (love) {
      const lovedUser = await this.findOne(love);
      user.love = lovedUser;
    }
    return this.userRepository.save(user);
  }

  async findUserByKakaoId(kakaoId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { kakaoId } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID #${id} not found`);
    }
    return user;
  }

  async findByName(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with name ${username} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { love, ...rest } = updateUserDto;
    const user = await this.userRepository.preload({
      id: id,
      ...rest,
    });
    if (!user) {
      throw new NotFoundException(`User with ID #${id} not found`);
    }
    if (love) {
      const lovedUser = await this.findOne(love);
      user.love = lovedUser;
    }
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID #${id} not found`);
    }
  }

  async findOrCreateUser(createUserDto: CreateUserDto): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (!user) {
      user = await this.create(createUserDto);
    }
    return user;
  }
}
