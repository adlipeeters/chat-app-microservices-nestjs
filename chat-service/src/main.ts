import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

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
  await app.listen(3003);
}
bootstrap();
