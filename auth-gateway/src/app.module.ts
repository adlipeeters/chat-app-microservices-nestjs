import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserClientModule } from './user-client.module';

@Module({
  imports: [
    UserClientModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
