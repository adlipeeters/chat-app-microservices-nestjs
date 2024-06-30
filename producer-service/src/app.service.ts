import { Injectable } from '@nestjs/common';
import { ClientProxyFactory, Transport, ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${process.env.RABBITMQ_HOST}:5672`],
        queue: 'main_queue',
        queueOptions: {
          durable: false
        },
      },
    });
  }

  emitMessage() {
    return this.client.emit<any>('message_printed', { text: 'Hello from Producer' });
  }
}
