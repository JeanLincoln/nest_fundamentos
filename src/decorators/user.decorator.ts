import { createParamDecorator, NotFoundException } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

export const User = createParamDecorator(
  (filter: string, context: ExecutionContextHost) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new NotFoundException('User was not found!');

    if (!filter) return user;

    return user[filter];
  },
);
