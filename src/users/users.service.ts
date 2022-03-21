import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(userId: number) {
    return await this.userRepository.findOne(userId, {
      relations: ['projects'],
    });
  }
  async findByUsername(userName: string) {
    return await this.userRepository.findOne({
      where: {
        name: userName,
      },
    });
  }
}
