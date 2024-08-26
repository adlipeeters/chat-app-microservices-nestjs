import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:7000', // Allow requests from this origin
    credentials: true, // Allow cookies to be included in requests
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true, // Automatically transform payloads to match DTO classes
    forbidNonWhitelisted: true, // Disallow any object properties not explicitly specified in the DTO
    transformOptions: {
      enableImplicitConversion: true, // Allows automatic type conversion (e.g., converting a string to a number)
    }
  }));

  // Create the RabbitMQ microservice
  const microserviceApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${process.env.RABBITMQ_HOST}:5672`],
      queue: 'user_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  await microserviceApp.listen();

  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
