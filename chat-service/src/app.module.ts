import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { RoomModule } from './room/room.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MessageModule } from './message/message.module';
import { AuthClientModule } from './auth-client.module';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    AuthClientModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT, 10),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://redis:6379',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChatModule, RoomModule, MessageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
