import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Expose, Transform } from 'class-transformer';

export class TerminationResponseDto extends BaseResponseDto {
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
