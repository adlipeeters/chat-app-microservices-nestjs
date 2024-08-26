import { Module, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
    imports: [
        ClientsModule.register([{
            name: 'AUTH_CLIENT',
            transport: Transport.RMQ,
            options: {
                // urls: [`amqp://${process.env.RABBITMQ_HOST}:5672`],
                // urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:5672`],
                urls: [`amqp://${process.env.RABBITMQ_HOST}:5672`],
                queue: 'auth_queue',
                queueOptions: {
                    durable: false,
                },
            },
        }]),
    ],
    exports: [ClientsModule],
})
export class AuthClientModule { }
