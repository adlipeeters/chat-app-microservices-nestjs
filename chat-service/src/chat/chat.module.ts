import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessageModule } from 'src/message/message.module';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [
    // ClientsModule.register([{
    //   name: 'AUTH_CLIENT',
    //   transport: Transport.RMQ,
    //   options: {
    //     urls: [`amqp://${process.env.RABBITMQ_HOST}:5672`],
    //     queue: 'auth_queue',
    //     queueOptions: {
    //       durable: false
    //     },
    //   }
    // }]),
    MessageModule,
    RoomModule
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule { }
