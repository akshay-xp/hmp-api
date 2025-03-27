import { Role } from '@prisma/client';

export type JwtPayload = {
  sub: number;
  email: string;
  role: Role;
};

export type JwtUser = {
  userId: number;
  email: string;
  role: Role;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AccessToken = {
  accessToken: string;
};
