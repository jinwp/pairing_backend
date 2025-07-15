import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { ChatroomService } from '../chatroom/chatroom.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly chatroomService: ChatroomService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user', description: '새로운 사용자를 생성합니다.' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: User })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', description: '모든 사용자 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: 'Return all users.', type: [User] })
  findAll() {
    return this.userService.findAll();
  }

  @Get('by-name/:name')
  @ApiOperation({ summary: 'Get a user by name', description: '이름으로 특정 사용자를 조회합니다.' })
  @ApiParam({ name: 'name', description: 'The name of the user', type: String })
  @ApiResponse({ status: 200, description: 'Return the user.', type: User })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findByName(@Param('name') name: string) {
    return this.userService.findByName(name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID', description: 'ID로 특정 사용자를 조회합니다.' })
  @ApiParam({ name: 'id', description: 'The ID of the user', type: Number })
  @ApiResponse({ status: 200, description: 'Return the user.', type: User })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user', description: 'ID로 특정 사용자의 정보를 수정합니다.' })
  @ApiParam({ name: 'id', description: 'The ID of the user', type: Number })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.', type: User })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(+id, updateUserDto);
    if (updateUserDto.love) {
      const currentUser = await this.userService.findOne(+id);
      const lovedUser = await this.userService.findOne(updateUserDto.love);

      if (lovedUser && lovedUser.love === currentUser.id) {
        // Match found, create a chatroom
        const chatroom = await this.chatroomService.create({
          user1Id: currentUser.id,
          user2Id: lovedUser.id,
        });
        // TODO: Add logic to delete chatroom after 24 hours
      }
    }
    return updatedUser;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user', description: 'ID로 특정 사용자를 삭제합니다.' })
  @ApiParam({ name: 'id', description: 'The ID of the user', type: Number })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
