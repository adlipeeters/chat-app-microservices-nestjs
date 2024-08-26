import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MessagePattern } from '@nestjs/microservices';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/guards/AuthGuard';
import { plainToClass } from 'class-transformer';
import { GetUser } from 'src/guards/GetAuthenticatedUser';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // HTTP endpoint for creating a user
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Message pattern handler for creating a user
  @MessagePattern({ role: 'user', cmd: 'create' })
  createUserFromMessage(createUserDto: CreateUserDto) {
    console.log(createUserDto)
    return
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    const users = await this.userService.findAll();
    return users.map(user => plainToClass(User, user));
  }

  // @Get(':username')
  // findOne(@Param('username') username: string) {
  //   return this.userService.findOne({ username: username });
  // }
  @MessagePattern({ role: 'user', cmd: 'get' })
  findOne(data: { username?: string, id?: number }): Promise<User> {
    // return this.userService.findOne({ username: data.username });
    return this.userService.findOne(data);
  }

  @UseGuards(AuthGuard)
  @Get('/search-user/:search')
  @UseInterceptors(ClassSerializerInterceptor)
  searchUser(
    @Param('search') search: string,
  ): Promise<User[]> {
    return this.userService.searchUser(search);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getMe(@GetUser() data: any) {
    let db_user = await this.userService.findOne({ id: data.user.id });
    if (db_user.id) {
      delete db_user.password;
      delete db_user.createdAt;
      return {
        ...db_user,
        jwt: data.jwt
      }
    } else {
      throw new Error('User not found');
    }
  }
}
