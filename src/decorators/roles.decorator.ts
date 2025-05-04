import { SetMetadata } from '@nestjs/common';
import type { ROLES_ENUM } from 'src/enums/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ROLES_ENUM[]) => SetMetadata(ROLES_KEY, roles);
