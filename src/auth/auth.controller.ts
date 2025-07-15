import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // automatically redirects to Google login page
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request) {
    return {
      message: 'Login successful',
      user: req.user,
    };
  }

  @Post('google/login')
  async googleAuthLogin(@Body('token') token: string) {
    return this.authService.googleLogin(token);
  }

  @Post('login')
  async login(@Body() body: any) {
    const { email } = body;
    const user = await this.authService.login(email);
    if (!user) {
      return { message: 'Login failed' };
    }
    return user;
  }
}
