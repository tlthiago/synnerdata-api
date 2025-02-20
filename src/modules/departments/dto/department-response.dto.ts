import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Expose } from 'class-transformer';

export class DepartmentResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Nome' })
  @Expose()
  nome: string;
}
