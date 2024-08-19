import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  login(@Body() body: { username: string; password: string }) {
    const username = body.username;
    const password = body.password;
    return this.authService.login(username, password);
  }
}
