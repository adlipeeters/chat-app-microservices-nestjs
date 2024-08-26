import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
