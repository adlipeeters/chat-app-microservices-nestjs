import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Room } from './entities/room.entity';
import { RoomMember } from './entities/room_member.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(RoomMember)
    private readonly roomMemberRepository: Repository<RoomMember>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager
  ) { }
  async create(createRoomDto: CreateRoomDto) {
    const room = await this.roomRepository.save(createRoomDto);
    await this.roomMemberRepository.save({
      user_id: room.owner_id,
      chat_room_id: room.id
    });

    return room;
  }

  async findAll(user_id: number) {
    // Find rooms where the user is the owner
    const ownedRooms = await this.roomRepository.find({
      where: {
        owner_id: user_id
      }
    });

    // Find room memberships for the user
    const roomMemberships = await this.roomMemberRepository.find({
      where: {
        user_id
      },
      relations: ['room']
    });

    // Extract rooms from the room memberships
    const memberRooms = roomMemberships.map(membership => membership.room);

    // Combine the owned rooms and member rooms, avoiding duplicates
    const allRooms = [...ownedRooms, ...memberRooms.filter(room => !ownedRooms.some(ownedRoom => ownedRoom.id === room.id))];

    return allRooms;
  }

  async findOne(id: number) {
    const room = await this.roomRepository.findOne({
      where: {
        id
      },
      relations: ['members']
    });

    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    const memberIds = room.members.map(member => member.user_id);

    // Query the user table to get the member names
    const members = await this.entityManager.query(
      `SELECT id, name, username FROM user WHERE id IN (${memberIds.join(',')})`
    );

    // Attach the member names to the room members
    room.members = room.members.map(member => {
      const user = members.find(user => user.id === member.user_id);
      return {
        ...member,
        name: user ? user.name : null,
        username: user ? user.username : null,
      };
    });

    return room;
  }

  async isRoomMember(room_id: number, user_id: number) {
    const member = await this.roomMemberRepository.findOne({
      where: {
        user_id,
        chat_room_id: room_id
      }
    });

    return !!member;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }

  async addUser(room_id: number, user_id: number) {
    const member = await this.roomMemberRepository.findOne({
      where: {
        user_id,
        chat_room_id: room_id
      }
    });

    if (member) {
      throw new HttpException('User is already a member of this room', HttpStatus.CONFLICT);
    }

    return this.roomMemberRepository.save({
      user_id,
      chat_room_id: room_id
    });
  }

  async removeUser(room_id: number, user_id: number) {
    const room = await this.roomRepository.findOne({
      where: {
        id: room_id
      }
    });

    if (room.owner_id === user_id) {
      throw new HttpException('Owner of the room cannot be removed', HttpStatus.CONFLICT);
    }

    const member = await this.roomMemberRepository.findOne({
      where: {
        user_id,
        chat_room_id: room_id
      }
    });

    if (!member) {
      throw new HttpException('User is not a member of this room', HttpStatus.CONFLICT);
    }

    return this.roomMemberRepository.delete({
      user_id,
      chat_room_id: room_id
    });
  }
}
