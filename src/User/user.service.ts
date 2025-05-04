import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    const password = this.#hashPassword(data.password);

    return this.prisma.user.create({
      data: { ...data, password },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findById(id: number) {
    await this.checkIfUserExists(id);

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, data: UpdatePutUserDTO) {
    await this.checkIfUserExists(id);

    const formattedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (key === 'password') {
        acc[key] = this.#hashPassword(value);
        return acc;
      }

      acc[key] = !value ? null : value;
      return acc;
    }, {});

    return this.prisma.user.update({ where: { id }, data: formattedData });
  }

  async updatePartial(id: number, data: UpdatePatchUserDTO) {
    await this.checkIfUserExists(id);

    const formattedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (key === 'password') {
        acc[key] = this.#hashPassword(value);
        return acc;
      }

      acc[key] = value;
      return acc;
    }, {});

    return this.prisma.user.update({ where: { id }, data: formattedData });
  }

  async delete(id: number) {
    await this.checkIfUserExists(id);

    return this.prisma.user.delete({ where: { id } });
  }

  async checkIfUserExists(id: number) {
    const count = await this.prisma.user.count({ where: { id } });

    if (!count) {
      throw new NotFoundException('User not found');
    }
  }

  #hashPassword(password: string) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  }
}
