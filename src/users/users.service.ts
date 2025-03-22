import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service.js';
import { UpdateUser } from './dto/update-user.dto.js';

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

  updateUser(userId: number, dto: UpdateUser) {
    const user = this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email: dto.email,
        name: dto.name,
      },
      omit: {
        password: true,
        refreshToken: true,
      },
    });

    return user;
  }
}
