import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, pass: string): Promise<any> {
    console.log('Login attempt with email:', email, 'and password:', pass);
    const user = await this.userService.findByEmail(email);
    if (!user) {
      console.log('User not found');
      return null;
    }
    console.log('User found:', user);
    if (user.password !== pass) {
      console.log('Password does not match');
      return null;
    }
  }

  async kakaoLogin(code: string): Promise<any> {
    const KAKAO_REST_API_KEY = this.configService.get<string>(
      'KAKAO_REST_API_KEY',
    );
    const KAKAO_REDIRECT_URI = 'http://172.20.12.170/auth/kakao/callback';

    // 1. Get Access Token
    const tokenResponse = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: KAKAO_REST_API_KEY,
          redirect_uri: KAKAO_REDIRECT_URI,
          code,
        },
      },
    );

    const { access_token } = tokenResponse.data;

    // 2. Get User Info
    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { id, properties } = userResponse.data;
    const username = properties.nickname;
    const profileImage = properties.profile_image;

    // 3. Find or create user
    const user = await this.userService.findOrCreateUser({
      kakaoId: id,
      username,
      profileImage,
      email: `${id}@kakao.com`,
    });
  }
}
