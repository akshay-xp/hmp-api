import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'atLeastOne', async: false })
class AtLeastOne implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments) {
    const { email, phone } = args.object as { email?: string; phone?: string };
    return !!email || !!phone; // Returns true if at least one is present
  }

  defaultMessage() {
    return 'Either email or phone must be provided';
  }
}

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

  @Validate(AtLeastOne)
  atLeastOne!: boolean;
}
