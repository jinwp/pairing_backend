import { Controller, Get, Query, Res, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.login(loginDto.email, loginDto.password);
    if (!user) {
      return { message: 'Login failed' };
    }
    return user;
  }
  
  @Get('/kakao/callback')
  async kakaoCallback(
    @Query('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.authService.kakaoLogin(code);
    // res.redirect('http://localhost:3000');
    res.send(user);
  }
}
