import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MockUserInterceptor implements NestInterceptor {
  private userId: string;

  setUserId(userId: string) {
    this.userId = userId;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    request.user = {
      id: this.userId,
    };

    return next.handle();
  }
}
