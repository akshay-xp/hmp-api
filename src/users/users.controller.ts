import { Body, Controller, Get, Patch } from '@nestjs/common';
import { GetUser } from 'src/decorators/get-jwt-user.decorator.js';
import { UsersService } from './users.service.js';
import { UpdateUser } from './dto/update-user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  getUser(@GetUser('userId') userId: number) {
    return this.usersService.getUser(userId);
  }

  @Patch('/me')
  updateUser(@GetUser('userId') userId: number, @Body() dto: UpdateUser) {
    return this.usersService.updateUser(userId, dto);
  }
}
