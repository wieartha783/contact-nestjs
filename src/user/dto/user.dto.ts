import { Exclude, Expose } from 'class-transformer';
import { Contact } from '../contact/entities/contact.entity';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  contacts: Contact[];

  @Exclude()
  password: string;
}
