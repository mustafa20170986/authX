import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: ' email cannot be empty ' })
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'password cannot be less than 6 digit' })
  password!: string;
}
