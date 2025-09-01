import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { EMPLOYEE_IMPORT_CONFIG } from '../employees.config';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;

    if (!file) {
      throw new BadRequestException('Arquivo obrigatório');
    }

    if (!EMPLOYEE_IMPORT_CONFIG.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Apenas arquivos .xlsx são permitidos');
    }

    if (file.size > EMPLOYEE_IMPORT_CONFIG.MAX_FILE_SIZE) {
      throw new BadRequestException(
        'Arquivo excede o tamanho máximo permitido (15MB)',
      );
    }

    return next.handle();
  }
}
