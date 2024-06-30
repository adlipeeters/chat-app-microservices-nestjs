import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  @EventPattern('message_printed')
  handleMessagePrinted(@Payload() data: any) {
    console.log('Message received: ', data.text);
  }
}
