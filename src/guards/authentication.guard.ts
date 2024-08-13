import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private jwtSevice: JwtService) {}

  private readonly logger = new Logger(AuthenticationGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.headers.authorization === undefined) {
      throw new UnauthorizedException('No athentication details provided');
    }

    const token = request.headers.authorization.split(' ')[1] ?? null;

    if (token === null) {
      throw new UnauthorizedException();
    }

    if (!this.jwtSevice.verify(token)) {
      throw new HttpException('Bad token provided', HttpStatus.BAD_REQUEST);
    }

    this.logger.log('Guard Called ', request.Body);
    return true;
  }
}
