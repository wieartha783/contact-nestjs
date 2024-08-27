import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { ContactService } from 'src/user/contact/contact.service';

@Injectable() // @Todo: I want use (@CurrentUser() user: User here, how can I add it propperly?
export class ContactOwnerGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private contactService: ContactService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const user = await this.authService.getUserFromAToken(token);

    // Extract contact ID from the request URL
    const contactId = request.params.id;

    console.log(contactId);

    // Fetch the contact and check if it belongs to the user
    const contact = await this.contactService.findOne(contactId);

    console.log(contact);

    if (!contact || contact.user.id !== user.id) {
      throw new UnauthorizedException('You do not have access to this contact');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string {
    const token = request.headers.authorization?.split(' ')[1];
    if (token == undefined) {
      throw new HttpException('No token provided', HttpStatus.FORBIDDEN);
    }
    return token;
  }
}
