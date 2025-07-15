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
}
