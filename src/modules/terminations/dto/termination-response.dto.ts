import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Transform } from 'class-transformer';

export class TerminationResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Data da demissão.' })
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  data: string;

  @ApiProperty({ description: 'Motivo interno da demissão.' })
  motivoInterno: string;

  @ApiProperty({ description: 'Motivo trabalhista da demissão.' })
  motivoTrabalhista: string;

  @ApiProperty({ description: 'Ação trabalhista.' })
  acaoTrabalhista: string;

  @ApiProperty({ description: 'Forma de demissão.' })
  formaDemissao: string;
}
