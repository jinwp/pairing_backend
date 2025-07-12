import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from 'typeorm';

@Entity('users') // DB 테이블 이름 
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', unique: true })
    email: string;

    @Column({ type: 'varchar', length: 30 })
    username: string;

    @Column({ type: 'int' })
    age: number;

    @Column ({ type: 'int'})
    class: number;

    @Column ({ type: 'varchar', length: 4, name: 'profileemoji', nullable: true })
    profileEmoji: string;

    @Column({ type: 'text', nullable: true })
    comment: string;

    @Column({ type: 'int', default: 0 })
    love: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

}
