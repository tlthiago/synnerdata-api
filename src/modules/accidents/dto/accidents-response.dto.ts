import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Transform } from 'class-transformer';

export class AccidentResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Descrição do acidente.' })
  descricao: string;

  @ApiProperty({ description: 'Data do acidente.' })
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  data: string;

  @ApiProperty({ description: 'Natureza do acidente.' })
  natureza: string;

  @ApiProperty({ description: 'Número do CAT.' })
  cat: string;

  @ApiProperty({ description: 'Medidas tomadas após o acidente.' })
  medidasTomadas: string;
}
