import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getUser(userId: number) {
    const user = this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        password: true,
        refreshToken: true,
      },
    });

    return user;
  }
}
