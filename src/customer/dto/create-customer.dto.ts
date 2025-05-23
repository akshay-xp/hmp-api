import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { AtLeastOneField } from 'src/decorators';

export class CreateCustomer {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @AtLeastOneField('email', 'phone')
  atLeastOne!: boolean;
}
