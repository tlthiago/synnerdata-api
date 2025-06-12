import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Expose, Transform, Type } from 'class-transformer';
import { EmployeeShortDto } from '../../employees/dto/employee-short.dto';

export class WarningResponseDto extends BaseResponseDto {
  @ApiProperty({ type: EmployeeShortDto })
  @Expose()
  @Type(() => EmployeeShortDto)
  funcionario: EmployeeShortDto;

  @ApiProperty({ description: 'Data da advertência.' })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  data: string;

  @ApiProperty({ description: 'Motivo da advertência.' })
  @Expose()
  motivo: string;
}
