import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, User } from 'generated/prisma';
import type { AuthRegisterDto } from './dto/auth.register.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaClient,
    private readonly mailer: MailerService,
  ) {}

  async createToken(user: User) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '2 days',
          subject: user.id.toString(),
          issuer: 'api-auth',
          audience: 'users',
        },
      ),
    };
  }

  async verifyToken(token: string) {
    const { id } = await this.jwtService.verify(token);
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) throw new UnauthorizedException('Email e/ou senha incorretos');

    await this.#validatePassword(password, user.password);

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) throw new NotFoundException('Email não encontrado');

    const token = this.jwtService.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      {
        expiresIn: '30 minutes',
        subject: user.id.toString(),
        issuer: 'forget',
        audience: 'users',
      },
    );

    await this.mailer.sendMail({
      to: `teste@dev${Math.random().toString(36).substring(2)}.com.br`,
      subject: 'Recuperação de senha',
      template: 'forget',
      context: {
        name: user.name,
        token,
      },
    });

    return true;
  }

  async reset(password: string, token: string) {
    try {
      const { id } = await this.jwtService.verify(token, {
        issuer: 'forget',
        audience: 'users',
      });

      if (isNaN(Number(id))) throw new UnauthorizedException('Token inválido');

      const salt = bcrypt.genSaltSync();
      const hashedPassword = bcrypt.hashSync(password, salt);

      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          password: hashedPassword,
        },
      });

      return this.createToken(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async register(body: AuthRegisterDto) {
    const user = await this.prisma.user.create({
      data: body,
    });

    return this.createToken(user);
  }

  async #validatePassword(password: string, userPassword: string) {
    const passwordMatch = await bcrypt.compare(password, userPassword);

    if (!passwordMatch) {
      throw new UnauthorizedException('Email e/ou senha incorretos');
    }

    return true;
  }
}
