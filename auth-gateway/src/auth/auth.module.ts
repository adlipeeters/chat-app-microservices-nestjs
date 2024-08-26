import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import constants from './constants';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: constants.jwtSecret,
      signOptions: { expiresIn: '3600s' }
    }),
    // ClientsModule.register([{
    //   name: 'USER_CLIENT',
    //   transport: Transport.RMQ,
    //   options: {
    //     // host: 'localhost',
    //     // port: 4000
    //     urls: [`amqp://${process.env.RABBITMQ_HOST}:5672`],
    //     queue: 'user_queue',
    //     queueOptions: {
    //       durable: false
    //     },
    //   }
    // }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule { }
