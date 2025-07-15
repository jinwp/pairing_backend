import 'express';

declare global {
  namespace Express {
    interface User {
      email: string;
      name: string;
      picture: string;
      accessToken: string;
    }

    interface Request {
      user?: User;
    }
  }
}
