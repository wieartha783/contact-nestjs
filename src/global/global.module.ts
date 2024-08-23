import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { ContactModule } from 'src/user/contact/contact.module';

@Global()
@Module({
  imports: [
    ContactModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '3600s' },
    }),
    AuthModule,
  ],
  exports: [JwtModule, AuthModule],
})
export class GlobalModule {}
