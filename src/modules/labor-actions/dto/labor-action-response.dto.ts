import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { BaseResponseDto } from 'src/common/utils/dto/base-response.dto';

export class LaborActionResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Número do processo.' })
  numeroProcesso: string;

  @ApiProperty({ description: 'Tribunal ou vara.' })
  tribunal: string;

  @ApiProperty({ description: 'Data do ajuizamento.' })
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  dataAjuizamento: string;

  @ApiProperty({ description: 'Nome do reclamante.' })
  reclamante: string;

  @ApiProperty({ description: 'Nome do reclamado.' })
  reclamado: string;

  @ApiProperty({ description: 'Advogado do reclamante.' })
  advogadoReclamante?: string;

  @ApiProperty({ description: 'Advogado do reclamado.' })
  advogadoReclamado?: string;

  @ApiProperty({ description: 'Descrição da ação.' })
  descricao: string;

  @ApiProperty({ description: 'Valor da causa.' })
  valorCausa?: number;

  @ApiProperty({ description: 'Andamento do processo.' })
  andamento?: string;

  @ApiProperty({ description: 'Decisões e sentenças.' })
  decisao?: string;

  @ApiProperty({ description: 'Data de conclusão.' })
  @Transform(({ value }) =>
    value
      ? new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
        }).format(new Date(value))
      : null,
  )
  dataConclusao?: string;

  @ApiProperty({ description: 'Recursos interpostos.' })
  recursos?: string;

  @ApiProperty({ description: 'Custas e despesas.' })
  custasDespesas?: number;

  @ApiProperty({ description: 'Data do conhecimento.' })
  @Transform(({ value }) =>
    value
      ? new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
        }).format(new Date(value))
      : null,
  )
  dataConhecimento: string;
}
