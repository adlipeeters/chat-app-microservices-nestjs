import { Module, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

console.log(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:5672`);

@Global()
@Module({
    imports: [
        ClientsModule.register([{
            name: 'USER_CLIENT',
            transport: Transport.RMQ,
            options: {
                // urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:5672`],
                urls: [`amqp://${process.env.RABBITMQ_HOST}:5672`],
                queue: 'user_queue',
                queueOptions: {
                    durable: false,
                },
            },
        }]),
    ],
    exports: [ClientsModule],
})
export class UserClientModule { }
