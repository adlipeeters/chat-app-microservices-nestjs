import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${process.env.RABBITMQ_HOST}:5672`],
      queue: 'main_queue',
      queueOptions: {
        durable: false
      },
    },
  });

  await app.listen();
}
bootstrap();
