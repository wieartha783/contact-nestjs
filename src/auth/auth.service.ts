import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
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
      user: userWithoutPassword,
    };
  }

  async getUserFromAToken(token: string): Promise<User> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return await this.userSrvice.findOne(payload.id);
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
  // jwtSign = (payload: UserWithoutPassword) => this.jwtService.sign(payload);
}
