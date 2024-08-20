import {
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import IsPhoneNumberConstraint from 'src/validators/phone-validator';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @Validate(IsPhoneNumberConstraint)
  phone: string;

  @IsOptional()
  @IsString()
  postCode?: string;

  @IsNotEmpty()
  @IsString()
  userId: number;
}
