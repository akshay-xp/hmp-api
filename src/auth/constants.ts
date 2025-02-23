import { CookieOptions } from 'express';

export const refreshTokenAge = 24 * 60 * 60 * 1000;
export const accessTokenAge = 15 * 60 * 1000;

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: true,
  maxAge: refreshTokenAge,
  path: '/auth',
};
