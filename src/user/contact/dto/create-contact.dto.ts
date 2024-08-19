import {
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsString,
  MaxLength,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPhoneNumber', async: false })
class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(phone: string): boolean {
    // Basic regex to validate international phone numbers
    const phoneRegex = /^\+(\d{1,3})\s?\d{4,14}(\s\d{4,14})?$/;
    return phoneRegex.test(phone);
  }

  defaultMessage(): string {
    return 'Phone number must be in a valid international format.';
  }
}

export class CreateContactDto {
  validate(phone: string): boolean {
    const phoneRegex = /^\+(\d{1,3})\s?\d{4,15}(\s\d{4,15})?$/;
    return phoneRegex.test(phone);
  }

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
  @Validate(IsPhoneNumberConstraint, {
    message: 'Phone number must be a valid international format.',
  })
  phone: string;

  @IsOptional()
  @IsString()
  postCode?: string;

  @IsNotEmpty()
  @IsString()
  userId: number;
}
