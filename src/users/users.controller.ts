import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { GetUser } from 'src/decorators/get-jwt-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

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
