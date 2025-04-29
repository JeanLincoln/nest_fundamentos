import { BadRequestException, type NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class UserIdCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const isNaN = Number.isNaN(Number(req.params.id));
    const isNegative = Number(req.params.id) < 0;

    console.log('UserIdCheckMiddleware', 'antes');

    if (isNaN || isNegative) {
      throw new BadRequestException('Invalid user id');
    }

    console.log('UserIdCheckMiddleware', 'depois');

    next();
  }
}
