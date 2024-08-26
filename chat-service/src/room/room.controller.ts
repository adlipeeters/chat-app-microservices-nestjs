import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { GetUser } from 'src/guards/GetAuthenticatedUser';
import { AuthGuard } from 'src/guards/AuthGuard';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    @InjectRedis() private readonly redisService: Redis,
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  create(
    @GetUser() userData: any,
    @Body() createRoomDto: CreateRoomDto
  ) {
    createRoomDto.owner_id = userData.user.id;
    return this.roomService.create(createRoomDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@GetUser() userData: any,) {
    return this.roomService.findAll(userData.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Post('/add-user')
  async addUser(
    @GetUser() userData: any,
    @Body() data: { room_id: number, user_id: number }) {
    // check if the user is the owner of the room

    const room = await this.roomService.findOne(data.room_id);
    if (room.owner_id !== userData.user.id) {
      throw new HttpException('You are not authorized to add a user to this room', HttpStatus.UNAUTHORIZED);
    }

    return this.roomService.addUser(data.room_id, data.user_id);
  }

  @UseGuards(AuthGuard)
  @Post('/remove-user')
  async removeUser(
    @GetUser() userData: any,
    @Body() data: { room_id: number, user_id: number }) {
    // check if the user is the owner of the room

    const room = await this.roomService.findOne(data.room_id);
    if (room.owner_id !== userData.user.id) {
      throw new HttpException('You are not authorized to remove a user to this room', HttpStatus.UNAUTHORIZED);
    }

    return this.roomService.removeUser(data.room_id, data.user_id);
  }

  @UseGuards(AuthGuard)
  @Get('/typing-users/:id')
  async getTypingUsers(@GetUser() userData: any, @Param('id') roomId: string) {
    const isMember = await this.roomService.isRoomMember(Number(roomId), userData.user.id);
    if (!isMember) {
      throw new HttpException('You are not a member of this room', HttpStatus.UNAUTHORIZED);
    }

    const typingUsers = await this.redisService.smembers(`typing:${roomId}`);
    return typingUsers;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }

  @Get('/is-member/:room_id')
  @UseGuards(AuthGuard)
  async isRoomMember(@GetUser() userData: any, @Param('room_id') room_id: string) {
    return this.roomService.isRoomMember(+room_id, userData.user.id);
  }
}
