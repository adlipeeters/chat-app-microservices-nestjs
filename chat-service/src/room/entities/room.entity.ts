import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, Index } from 'typeorm';
import { RoomInterface } from "../room.interface";
import { RoomMember } from './room_member.entity';
import { Message } from 'src/message/entities/message.entity';

@Entity()
export class Room implements RoomInterface {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    owner_id: number;

    @Column()
    name: string;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;

    @OneToMany(() => RoomMember, roomMember => roomMember.room, { cascade: true })
    members: RoomMember[];

    @OneToMany(() => Message, message => message.chat_room_id, { cascade: true })
    messages: Message[];
}
