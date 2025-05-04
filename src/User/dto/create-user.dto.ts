import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ROLES_ENUM } from 'src/enums/roles.enum';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @IsDateString()
  @IsOptional()
  birthAt: Date;

  @IsEnum(ROLES_ENUM)
  @IsOptional()
  role: ROLES_ENUM;
}
