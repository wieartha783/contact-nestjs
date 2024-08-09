import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
