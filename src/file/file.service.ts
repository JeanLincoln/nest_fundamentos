import { BadRequestException, Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  async uploadFile(file: Express.Multer.File, path: string) {
    try {
      await writeFile(path, file.buffer);
      return true;
    } catch {
      throw new BadRequestException('Error uploading file');
    }
  }
}
