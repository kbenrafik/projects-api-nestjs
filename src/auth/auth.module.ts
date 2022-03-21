import { AuthController } from './auth.controller';
import { AnonymousStrategy } from './anonymous.strategy';

import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, JwtStrategy, AnonymousStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
