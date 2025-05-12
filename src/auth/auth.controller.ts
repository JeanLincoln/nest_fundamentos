import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AuthRegisterDto } from './dto/auth.register.dto';
import { AuthForgetDto } from './dto/auth.forget.dto';
import { AuthResetDto } from './dto/auth.reset.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { User as UserType } from 'generated/prisma';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { join } from 'path';
import { FileService } from 'src/file/file.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDto) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDto) {
    return this.authService.register(body);
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDto) {
    return this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDto) {
    return this.authService.reset(password, token);
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(
    @User() user: UserType | Record<string, string>,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/png' }),
          new MaxFileSizeValidator({ maxSize: 1000 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${user.id}.${fileExtension}`;

    const path = join(__dirname, '..', '..', 'storage', 'photos', fileName);

    await this.fileService.uploadFile(file, path);

    return {
      message: 'Photo uploaded successfully',
      file,
    };
  }

  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('files')
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return files;
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo', maxCount: 1 },
      { name: 'documents', maxCount: 10 },
    ]),
  )
  @UseGuards(AuthGuard)
  @Post('files-fields')
  async uploadfilesFields(
    @UploadedFiles()
    files: {
      photo: Express.Multer.File[];
      documents: Express.Multer.File[];
    },
  ) {
    return files;
  }
}
