export type JwtPayload = {
  sub: number;
  email: string;
};

export type JwtUser = {
  userId: number;
  email: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AccessToken = {
  accessToken: string;
};
