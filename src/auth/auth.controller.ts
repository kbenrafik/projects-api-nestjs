import { Login } from './login.type';
import { LoginUserDto } from './dto/user-login.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<Login> {
    return await this.authService.login(loginUserDto);
  }
}
