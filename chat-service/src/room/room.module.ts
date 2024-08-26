import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { Room } from './entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RoomMember } from './entities/room_member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, RoomMember]),
    // ClientsModule.register([{
    //   name: 'AUTH_CLIENT',
    //   transport: Transport.RMQ,
    //   options: {
    //     // host: 'localhost',
    //     // port: 4000
    //     urls: [`amqp://${process.env.RABBITMQ_HOST}:5672`],
    //     queue: 'auth_queue',
    //     queueOptions: {
    //       durable: false
    //     },
    //   }
    // }])
  ],

  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService]
})
export class RoomModule { }
