export type JwtPayload = {
  sub: string;
  email: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AccessToken = {
  accessToken: string;
};
