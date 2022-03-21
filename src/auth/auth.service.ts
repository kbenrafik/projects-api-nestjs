import { Login } from './login.type';
import { LoginUserDto } from './dto/user-login.dto';
import {
  Injectable,
  Dependencies,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
@Dependencies(UsersService, JwtService)
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<Login> {
    const user = await this.usersService.findByUsername(loginUserDto.username);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const payload = { username: loginUserDto.username, id: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
