import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, Index, ManyToOne } from 'typeorm';
import { MessageInterface } from '../message.interface';
import { Room } from 'src/room/entities/room.entity';

@Entity()
export class Message implements MessageInterface {
    @PrimaryGeneratedColumn()
    id: number;

    // @Index()
    @ManyToOne(() => Room, room => room.messages, { onDelete: 'CASCADE' })
    @Column({ nullable: true })
    chat_room_id: number;

    @Index()
    @Column()
    sender_id: number;

    // for private message
    @Index()
    @Column({ nullable: true })
    receiver_id: number;

    @Column({ type: 'text', })
    content: string;

    @CreateDateColumn()
    created_at: Date;

    // @CreateDateColumn()
    // updated_at: Date;

    // @OneToMany(() => RoomMember, roomMember => roomMember.room, { cascade: true })
    // members: RoomMember[];
}
