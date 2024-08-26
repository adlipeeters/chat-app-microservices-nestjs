import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);


  @MessagePattern('message_printed')
  handleMessagePrinted(@Payload() data: any) {
    console.log('Message received: ', data.text);
  }
}
