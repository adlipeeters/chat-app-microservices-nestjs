import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Index, JoinColumn, Unique } from 'typeorm';
import { RoomMemberInterface } from '../room_member.interface';
import { Room } from './room.entity';

@Entity()
@Unique(['user_id', 'chat_room_id'])
export class RoomMember implements RoomMemberInterface {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    user_id: number;

    @Index()
    @Column()
    chat_room_id: number;

    @CreateDateColumn()
    joined_at: Date;

    @ManyToOne(() => Room, room => room.members, { onDelete: 'CASCADE' })
    // @Index()
    @JoinColumn({ name: 'chat_room_id' })
    room: Room;
}
