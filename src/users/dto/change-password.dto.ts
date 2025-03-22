import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Current password cannot be empty' })
  currentPassword: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Your new password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.',
    },
  )
  newPassword: string;
}
