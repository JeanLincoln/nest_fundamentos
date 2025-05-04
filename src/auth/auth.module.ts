import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/User/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaClient } from 'generated/prisma';

@Module({
  imports: [
    JwtModule.register({
      secret: `j*l>n9MwIk@Q%YyJ@WrLh£&!B5w06QbA`,
    }),
    PrismaModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaClient],
  exports: [AuthService],
})
export class AuthModule {}
