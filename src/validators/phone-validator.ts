import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
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

export default IsPhoneNumberConstraint;
