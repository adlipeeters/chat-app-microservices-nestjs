import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly roomRepository: Repository<Message>) { }
  create(createMessageDto: CreateMessageDto) {
    return this.roomRepository.save(createMessageDto);
  }

  findAll(data: {
    chat_room_id?: number,
    sender_id?: number,
    receiver_id?: number,
  }) {
    return this.roomRepository.find({
      where: {
        ...data
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
