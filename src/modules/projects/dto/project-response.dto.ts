import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Transform } from 'class-transformer';

export class ProjectResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Nome do projeto.' })
  nome: string;

  @ApiProperty({ description: 'Descrição do projeto.' })
  descricao: string;

  @ApiProperty({ description: 'Data de início do projeto.' })
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  dataInicio: Date;

  @ApiProperty({ description: 'Cno do projeto' })
  cno: string;
}
