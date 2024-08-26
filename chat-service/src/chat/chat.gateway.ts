import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import * as cookie from 'cookie';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { MessageService } from 'src/message/message.service';
import { RoomService } from '../room/room.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@WebSocketGateway(8001, { cors: '*' })
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(
    @Inject('AUTH_CLIENT')
    private readonly authClient: ClientProxy,
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
    @InjectRedis() private readonly redisService: Redis,
  ) { }

  async handleConnection(client: Socket) {
    // const cookies = cookie.parse(client.handshake.headers.cookie || '');
    const jwt = client.handshake.auth.token;
    const isValid = await firstValueFrom(
      this.authClient.send(
        { role: 'auth', cmd: 'check' },
        { jwt }
      ).pipe(timeout(5000))
    );
    // console.log(isValid)
    // console.log(isValid.user)


    if (!jwt || !isValid) {
      client.disconnect();
      return;
    }

    // Store user information on the client object
    client.data.user = isValid.user;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string): void {
    client.join(room);
    client.emit('joinedRoom', room);
    console.log(`Client ${client.id} joined room ${room}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string): void {
    client.leave(room);
    client.emit('leftRoom', room);
    console.log(`Client ${client.id} left room ${room}`);
  }

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string, message: string }): Promise<void> {
    const { room, message } = data;
    const isMember = await this.roomService.isRoomMember(Number(room), client.data.user.id);

    if (!isMember) {
      client.emit('error', 'You are not a member of this room');
      return;
    }

    // Retrieve user information from the client object
    const user = client.data.user;
    console.log(`Message from ${user.id} (${client.id}) in room ${room}: ${message}`);

    // Optionally save the message to the database
    await this.messageService.create({
      chat_room_id: Number(room),
      sender_id: user.id,
      content: message,
    });

    // this.server.to(room).emit('message', { user: user.username, message });
    this.server.to(room).emit('message', { content: message, sender_id: user.id });
  }

  @SubscribeMessage('is_typing')
  async handleTyping(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string, typing: boolean, username: string }): Promise<void> {
    const { room, typing, username } = data;
    const isMember = await this.roomService.isRoomMember(Number(room), client.data.user.id);
    console.log(isMember);

    if (!isMember) {
      client.emit('error', 'You are not a member of this room');
      return;
    }

    const user = client.data.user;
    console.log(`User ${user.id} (${client.id}) is typing in room ${room}: ${typing}`);

    if (typing) {
      await this.redisService.sadd(`typing:${room}`, username);
    } else {
      await this.redisService.srem(`typing:${room}`, username);
    }

    const typingUsers = await this.redisService.smembers(`typing:${room}`);
    this.server.to(room).emit('is_typing', { typingUsers });
  }

  // @SubscribeMessage('createChat')
  // create(@MessageBody() createChatDto: CreateChatDto) {
  //   return this.chatService.create(createChatDto);
  // }

  // @SubscribeMessage('findAllChat')
  // findAll() {
  //   return this.chatService.findAll();
  // }

  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatService.findOne(id);
  // }

  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(updateChatDto.id, updateChatDto);
  // }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatService.remove(id);
  // }
}
