import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard } from 'src/guards/AuthGuard';
import { RoomService } from 'src/room/room.service';
import { GetUser } from 'src/guards/GetAuthenticatedUser';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService
  ) { }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get('/room/:id')
  @UseGuards(AuthGuard)
  async findAll(
    @GetUser() userData: any,
    @Param('id') chat_room_id: number,
  ) {
    const isMember = await this.roomService.isRoomMember(chat_room_id, userData.user.id);

    if (isMember) {
      return this.messageService.findAll({ chat_room_id: +chat_room_id });
    } else {
      throw new HttpException('You are not authorized to view messages in this room', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
