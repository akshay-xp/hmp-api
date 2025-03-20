import { Controller, Get } from '@nestjs/common';
import { GetUser } from 'src/decorators/get-jwt-user.decorator.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  getUser(@GetUser('userId') userId: number) {
    return this.usersService.getUser(userId);
  }
}
