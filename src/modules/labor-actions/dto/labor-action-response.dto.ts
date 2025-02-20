import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';

export class LaborActionResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Número do processo.' })
  @Expose()
  numeroProcesso: string;

  @ApiProperty({ description: 'Tribunal ou vara.' })
  @Expose()
  tribunal: string;

  @ApiProperty({ description: 'Data do ajuizamento.' })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  dataAjuizamento: string;

  @ApiProperty({ description: 'Nome do reclamante.' })
  @Expose()
  reclamante: string;

  @ApiProperty({ description: 'Nome do reclamado.' })
  @Expose()
  reclamado: string;

  @ApiProperty({ description: 'Advogado do reclamante.' })
  @Expose()
  advogadoReclamante?: string;

  @ApiProperty({ description: 'Advogado do reclamado.' })
  @Expose()
  advogadoReclamado?: string;

  @ApiProperty({ description: 'Descrição da ação.' })
  @Expose()
  descricao: string;

  @ApiProperty({ description: 'Valor da causa.' })
  @Expose()
  valorCausa?: number;

  @ApiProperty({ description: 'Andamento do processo.' })
  @Expose()
  andamento?: string;

  @ApiProperty({ description: 'Decisões e sentenças.' })
  @Expose()
  decisao?: string;

  @ApiProperty({ description: 'Data de conclusão.' })
  @Expose()
  @Transform(({ value }) =>
    value
      ? new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
        }).format(new Date(value))
      : null,
  )
  dataConclusao?: string;

  @ApiProperty({ description: 'Recursos interpostos.' })
  @Expose()
  recursos?: string;

  @ApiProperty({ description: 'Custas e despesas.' })
  @Expose()
  custasDespesas?: number;

  @ApiProperty({ description: 'Data do conhecimento.' })
  @Expose()
  @Transform(({ value }) =>
    value
      ? new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
        }).format(new Date(value))
      : null,
  )
  dataConhecimento: string;
}
