import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';
import { AccessToken, AuthTokens } from './types';
import { accessTokenAge, refreshTokenAge } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signTokens(userId: number, email: string): Promise<AuthTokens> {
    const payload = {
      sub: userId,
      email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(payload, {
        expiresIn: accessTokenAge,
        secret: this.config.get('ACCESS_TOKEN_SECRET'),
      }),
      await this.jwtService.signAsync(payload, {
        expiresIn: refreshTokenAge,
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const hashedToken = await hash(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashedToken,
      },
    });
  }

  async signUp(dto: SignUpDto): Promise<AuthTokens> {
    const hashedPassword = await hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hashedPassword,
        },
      });

      const tokens = await this.signTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Credentials Taken');
        }
      }
      throw error;
    }
  }

  async signIn(dto: SignInDto): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credentials Incorrect');
    }

    const isVerified = await verify(user.password, dto.password);
    if (!isVerified) {
      throw new ForbiddenException('Credentials Incorrect');
    }

    const tokens = await this.signTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async signOut(refreshToken: string): Promise<void> {
    if (!refreshToken) {
      return;
    }

    const payload = await this.jwtService.verifyAsync<{ sub: number }>(
      refreshToken,
      {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      },
    );

    if (payload.sub) {
      await this.prisma.user.update({
        where: {
          id: payload.sub,
          refreshToken: {
            not: null,
          },
        },
        data: {
          refreshToken: null,
        },
      });
    }
  }

  async signAccessToken(userId: number, email: string): Promise<AccessToken> {
    const payload = {
      sub: userId,
      email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: accessTokenAge,
      secret: this.config.get('ACCESS_TOKEN_SECRET'),
    });

    return {
      accessToken,
    };
  }

  async refresh(refreshToken: string): Promise<AccessToken> {
    if (!refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const payload = await this.jwtService.verifyAsync<{ sub: number }>(
      refreshToken,
      {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      },
    );

    if (!payload.sub) {
      throw new ForbiddenException('Credentials Incorrect');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const isVerified = await verify(user.refreshToken, refreshToken);
    if (!isVerified) {
      throw new ForbiddenException('Access Denied');
    }

    return this.signAccessToken(user.id, user.email);
  }
}
