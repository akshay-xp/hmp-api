import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUser {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
