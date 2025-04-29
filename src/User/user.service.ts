import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import type { UpdatePutUserDTO } from './dto/update-put-user.dto';
import type { UpdatePatchUserDTO } from './dto/update-patch-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    return this.prisma.user.create({ data });
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
      acc[key] = !value ? null : value;
      return acc;
    }, {});

    return this.prisma.user.update({ where: { id }, data: formattedData });
  }

  async updatePartial(id: number, data: UpdatePatchUserDTO) {
    await this.checkIfUserExists(id);

    return this.prisma.user.update({ where: { id }, data });
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
}
