import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

type UserWithoutPassword = {
  id: number;
  email: string;
  username: string;
};

@Injectable()
export class AuthService {
  constructor(
    private userSrvice: UserService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userSrvice.findWithLogin(username);
    if (user === null) {
      throw new HttpException(`Can't find the user`, HttpStatus.NOT_FOUND);
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      throw new HttpException(
        `Username and passowrd combination missmatch`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const userWithoutPassword: UserWithoutPassword = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(userWithoutPassword),
    };
  }

  jwtSign = (payload: UserWithoutPassword) => this.jwtService.sign(payload);
}
