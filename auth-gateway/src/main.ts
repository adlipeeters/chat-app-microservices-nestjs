import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  // Create the HTTP server
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:7000', // Allow requests from this origin
    credentials: true, // Allow cookies to be included in requests
  });
  await app.listen(3001);
  console.log('HTTP server listening on port 3000');

  // Create the RabbitMQ microservice
  const microserviceApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${process.env.RABBITMQ_HOST}:5672`],
      queue: 'auth_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  await microserviceApp.listen();
  console.log('RabbitMQ microservice is listening');
}

bootstrap();
