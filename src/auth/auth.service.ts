<<<<<<< HEAD
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
    const user = await this.userService.findByEmail(email);
    if (!user || user.password !== pass) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
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

=======
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async googleLogin(token: string): Promise<{ isNewUser: boolean; user: any; accessToken?: string }> {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid token');
    }
    const { email, name: username } = payload;

    let user = await this.userService.findByEmail(email);

    if (user) {
      const payload = { sub: user.id, username: user.username };
      const accessToken = this.jwtService.sign(payload);
      return { isNewUser: false, user, accessToken };
    } else {
      // For a new user, we don't create them here.
      // We send back the information so the frontend can navigate to a sign-up page.
      return { isNewUser: true, user: { email, username } };
    }
  }

  async login(email: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }
    // we are not validating password for now
>>>>>>> 20d1df791f0c7eaabe59f3535628c275a6669ea2
    return user;
  }
}
