import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Expose, Transform } from 'class-transformer';

export class ProjectResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Nome do projeto.' })
  @Expose()
  nome: string;

  @ApiProperty({ description: 'Descrição do projeto.' })
  @Expose()
  descricao: string;

  @ApiProperty({ description: 'Data de início do projeto.' })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  dataInicio: string;

  @ApiProperty({ description: 'Cno do projeto' })
  @Expose()
  cno: string;
}
