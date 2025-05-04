import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, User } from 'generated/prisma';
import type { AuthRegisterDto } from './dto/auth.register.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaClient,
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

    // TODO: ENVIAR EMAIL....

    return true;
  }

  async reset(password: string, token: string) {
    // TODO: VALIDAR TOKEN....

    const id = 0; // PASSWORD VIRÁ NO TOKEN

    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });

    return this.createToken(user);
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
