import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Cookies } from 'src/decorators';
import { AccessToken } from './types';
import { refreshTokenCookieOptions } from './constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessToken> {
    const { accessToken, refreshToken } = await this.authService.signUp(dto);

    // set refresh token in http cookies
    response.cookie('jwt', refreshToken, refreshTokenCookieOptions);

    return { accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessToken> {
    const { accessToken, refreshToken } = await this.authService.signIn(dto);

    // set refresh token in http cookies
    response.cookie('jwt', refreshToken, refreshTokenCookieOptions);

    return { accessToken };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('signout')
  async signOut(
    @Cookies('jwt') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.signOut(refreshToken);

    // clear http cookie
    response.clearCookie('jwt', refreshTokenCookieOptions);
  }

  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  async refresh(@Cookies('jwt') refreshToken: string): Promise<AccessToken> {
    return await this.authService.refresh(refreshToken);
  }
}
