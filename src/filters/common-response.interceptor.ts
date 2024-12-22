import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CommonResponse } from 'src/modules/common/common-response.dto';

@Injectable()
export class CommonResponseInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CommonResponse<T>> {
    return next.handle().pipe(
      tap((data) => {
        if (!(data instanceof CommonResponse)) {
          return new CommonResponse<T>({
            statusCode: 200,
            message: 'Request successful.',
            ...data,
          });
        }
        return data;
      }),
    );
  }
}
