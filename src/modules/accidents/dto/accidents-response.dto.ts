import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Expose, Transform } from 'class-transformer';

export class AccidentResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Descrição do acidente.' })
  @Expose()
  descricao: string;

  @ApiProperty({ description: 'Data do acidente.' })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  data: string;

  @ApiProperty({ description: 'Natureza do acidente.' })
  @Expose()
  natureza: string;

  @ApiProperty({ description: 'Número do CAT.' })
  @Expose()
  cat: string;

  @ApiProperty({ description: 'Medidas tomadas após o acidente.' })
  @Expose()
  medidasTomadas: string;
}
