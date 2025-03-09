import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';
import { AtLeastOneField } from 'src/decorators';

export class GetCustomer {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @AtLeastOneField('email', 'phone')
  atLeastOne!: boolean;
}
