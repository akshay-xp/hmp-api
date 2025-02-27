import { CookieOptions } from 'express';

// requires seconds
export const refreshTokenAge = 24 * 60 * 60;
export const accessTokenAge = 15 * 60;

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: true,
  // requires milliseconds
  maxAge: refreshTokenAge * 1000,
  path: '/auth',
};
