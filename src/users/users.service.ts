import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { hash, verify } from 'argon2';

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

  updateUser(userId: number, dto: UpdateUserDto) {
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

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credentials Incorrect');
    }

    const isVerified = await verify(user.password, dto.currentPassword);
    if (!isVerified) {
      throw new ForbiddenException('Credentials Incorrect');
    }
    const isSameAsPrevious = await verify(user.password, dto.newPassword);
    if (isSameAsPrevious) {
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    }

    const hashedPassword = await hash(dto.newPassword);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
  }
}
