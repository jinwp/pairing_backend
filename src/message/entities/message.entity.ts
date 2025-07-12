import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Chatroom } from '../../chatroom/entities/chatroom.entity';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Chatroom, { eager: true })
  @JoinColumn({ name: 'chat_id' })
  chatroom: Chatroom;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column('text')
  message: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
