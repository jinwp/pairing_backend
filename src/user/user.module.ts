import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatroomModule } from '../chatroom/chatroom.module';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => ChatroomModule),],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
