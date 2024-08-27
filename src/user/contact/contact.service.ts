import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user.service';
import { User } from '../entities/user.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private userService: UserService,
  ) {}

  async create(createContact: CreateContactDto): Promise<Contact> {
    const currentUser = await this.userService.findOne(createContact.userId);
    if (!currentUser) {
      throw new HttpException(
        `User with id: ${createContact.userId} not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    const newContact = this.contactRepository.create(createContact);
    newContact.user = currentUser;
    return await this.contactRepository.save(newContact);
  }

  async findAll(): Promise<Contact[]> {
    return await this.contactRepository.find();
  }

  async findWhere(user: User): Promise<Contact[]> {
    return await this.contactRepository.find({
      where: {
        user: user
      }
    });
  }

  async findOne(id: number): Promise<Contact> {
    const contact = await this.contactRepository.findOne({where:{ id }});

    if (!contact) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }

    return contact;
  }

  async update(
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    const contact = await this.contactRepository.findOneBy({ id });

    if (!contact) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }

    const updatedContact = await this.contactRepository.update(
      id,
      updateContactDto,
    );

    if (!updatedContact) {
      throw new HttpException('Can`t update contact', 500);
    }

    const updatedNewContact = await this.contactRepository.findOneBy({ id });

    if (!updatedNewContact) {
      throw new HttpException('Can`t find the new contact', 404);
    }

    return updatedNewContact;
  }

  async remove(id: number): Promise<string> {
    const currentContact = await this.contactRepository.findOneBy({ id });
    if (!currentContact) {
      throw new HttpException('Can`t find the contact', 404);
    }

    const deletedContact = await this.contactRepository.delete(currentContact);

    if (deletedContact) {
      return `Contact ${currentContact.firstName} ${currentContact.lastName} deleted!`;
    }

    throw new HttpException('Can`t delete the contact', 500);
  }
}
