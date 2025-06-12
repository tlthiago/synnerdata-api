import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Expose, Transform, Type } from 'class-transformer';
import { EmployeeShortDto } from '../../employees/dto/employee-short.dto';

export class TerminationResponseDto extends BaseResponseDto {
  @ApiProperty({ type: EmployeeShortDto })
  @Expose()
  @Type(() => EmployeeShortDto)
  funcionario: EmployeeShortDto;

  @ApiProperty({ description: 'Data da demissão.' })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  data: string;

  @ApiProperty({ description: 'Motivo interno da demissão.' })
  @Expose()
  motivoInterno: string;

  @ApiProperty({ description: 'Motivo trabalhista da demissão.' })
  @Expose()
  motivoTrabalhista: string;

  @ApiProperty({ description: 'Ação trabalhista.' })
  @Expose()
  acaoTrabalhista: string;

  @ApiProperty({ description: 'Forma de demissão.' })
  @Expose()
  formaDemissao: string;
}
