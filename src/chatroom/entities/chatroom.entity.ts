import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Message } from '../../message/entities/message.entity';

@Entity('chatroom')
export class Chatroom {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user1_id' })
  user1: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user2_id' })
  user2: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => Message, (message) => message.chatroom)
  messages: Message[];
}
