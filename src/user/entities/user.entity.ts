import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('users') // DB 테이블 이름
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'bigint', unique: true, nullable: true })
    kakaoId: number;

    @Column({ type: 'text', unique: true, nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    password?: string;

    @Column({ type: 'varchar', length: 30 })
    username: string;

    @Column({ type: 'text', nullable: true })
    profileImage: string;

    @Column({ type: 'int' })
    age: number;

    @Column ({ type: 'int'})
    class: number;

    @Column ({ type: 'varchar', length: 4, name: 'profileemoji', nullable: true })
    profileEmoji: string;

    @Column({ type: 'text', nullable: true })
    comment: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'love' })
    love: User;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

}
