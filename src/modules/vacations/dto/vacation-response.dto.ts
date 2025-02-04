import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Transform } from 'class-transformer';

export class VacationResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Data de início das férias.' })
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  dataInicio: string;

  @ApiProperty({ description: 'Data de encerramento das férias.' })
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  dataFim: string;
}
