import { User } from 'src/users/schemas/user.schema';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenResponse {
  accessToken: string;
  user: Partial<User>;
}
