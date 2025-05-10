import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/User/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaClient } from 'generated/prisma';
import { FileModule } from 'src/file/file.module';
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    forwardRef(() => UserModule),
    PrismaModule,
    FileModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaClient],
  exports: [AuthService],
})
export class AuthModule {}
