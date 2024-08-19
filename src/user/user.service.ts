import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = process.env.SALT_ROUND ?? '10';
    const password = await bcrypt.hash(
      createUserDto.password,
      parseInt(saltRounds),
    );
    createUserDto.password = password;
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  findAll() {
    this.logger.log('Hi, A user try to find all user');
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const userData = await this.userRepository.findOneBy({ id });

    if (!userData) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return userData;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const userData = await this.findOne(id);
    if (!userData) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.update(id, updateUserDto);

    const userDataUpdated = await this.userRepository.findOneBy({ id });

    if (!userDataUpdated) {
      throw new HttpException(
        'User not found after update',
        HttpStatus.NOT_FOUND,
      );
    }

    return userDataUpdated;
  }

  async remove(id: number, res: Response): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.remove(user);

    res
      .status(HttpStatus.OK)
      .json({ message: `User ${user.username} deleted` });
  }

  async findWithLogin(username: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ username });
    if (user === null) {
      throw new HttpException(
        `User with ${username} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }
}
