import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UserService } from './user.service';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { ParamId } from 'src/decorators/param-id.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { ROLES_ENUM } from 'src/enums/roles.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDTO) {
    return this.userService.create(body);
  }

  @Get()
  @Roles(ROLES_ENUM.ADMIN)
  async findAll() {
    return this.userService.findAll();
  }

  @Roles(ROLES_ENUM.ADMIN, ROLES_ENUM.USER)
  @Get(':id')
  async findById(@ParamId() id: number) {
    return this.userService.findById(id);
  }

  @Put(':id')
  @Roles(ROLES_ENUM.ADMIN, ROLES_ENUM.USER)
  async update(@ParamId() id: number, @Body() body: UpdatePutUserDTO) {
    return this.userService.update(id, body);
  }

  @Patch(':id')
  @Roles(ROLES_ENUM.ADMIN, ROLES_ENUM.USER)
  async partialUpdate(@ParamId() id: number, @Body() body: UpdatePatchUserDTO) {
    return this.userService.updatePartial(id, body);
  }

  @Delete(':id')
  @Roles(ROLES_ENUM.ADMIN)
  async delete(@ParamId() id: number) {
    return this.userService.delete(id);
  }
}
