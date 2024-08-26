import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  // inject user repository
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const password = await bcrypt.hash(createUserDto.password, 10);
    return this.userRepository.save({
      ...createUserDto,
      password,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // async findOne(id: number): Promise<User> {
  //   return this.userRepository.findOne({
  //     where: {
  //       id,
  //     },
  //   });
  // }

  findOne(data: { username?: string, id?: number }): Promise<User> {
    return this.userRepository.findOne({
      where: {
        ...data
      },
    });
  }

  async searchUser(search: string) {
    // wind user by username or email or name
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username LIKE :search', { search: `%${search}%` })
      .orWhere('user.email LIKE :search', { search: `%${search}%` })
      .orWhere('user.name LIKE :search', { search: `%${search}%` })
      .getMany();
  }

  getMe() {
    return 'Hello from user service';
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
