import { NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const dt = Date.now();

    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const method = request.method;
        const url = request.url;

        console.log(
          `URL: ${url}\nMETHOD: ${method}\nSTATUS: ${response.statusCode}\nA execução levou ${Date.now() - dt} milissegundos`,
        );
      }),
    );
  }
}
