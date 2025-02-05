import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Length,
  IsOptional,
} from 'class-validator';

export class CreateLaborActionDto {
  @ApiProperty({ description: 'Número do processo.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 12)
  numeroProcesso: string;

  @ApiProperty({ description: 'Tribunal ou vara.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  tribunal: string;

  @ApiProperty({ description: 'Data do ajuizamento.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  dataAjuizamento: string;

  @ApiProperty({ description: 'Nome do reclamante.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  reclamante: string;

  @ApiProperty({ description: 'Nome do reclamado.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  reclamado: string;

  @ApiProperty({ description: 'Advogado do reclamante.' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  advogadoReclamante?: string;

  @ApiProperty({ description: 'Advogado do reclamado.' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  advogadoReclamado?: string;

  @ApiProperty({ description: 'Descrição da ação.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  descricao: string;

  @ApiProperty({ description: 'Valor da causa.' })
  @IsNumber()
  @IsOptional()
  valorCausa?: number;

  @ApiProperty({ description: 'Andamento do processo.' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  andamento?: string;

  @ApiProperty({ description: 'Decisões e sentenças.' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  decisao?: string;

  @ApiProperty({ description: 'Data de conclusão.' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  dataConclusao?: string;

  @ApiProperty({ description: 'Recursos interpostos.' })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  recursos?: string;

  @ApiProperty({ description: 'Custas e despesas.' })
  @IsNumber()
  @IsOptional()
  @Length(1, 255)
  custasDespesas?: number;

  @ApiProperty({ description: 'Data do conhecimento.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  dataConhecimento: string;

  @ApiProperty({
    description: 'Usuário responsável pelo cadastro da ação trabalhista.',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
