import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { GetUser } from 'src/decorators/get-jwt-user.decorator.js';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  getUser(@GetUser('userId') userId: number) {
    return this.usersService.getUser(userId);
  }

  @Patch('/me')
  updateUser(@GetUser('userId') userId: number, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('/me/password')
  changePassword(
    @GetUser('userId') userId: number,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(userId, dto);
  }
}
