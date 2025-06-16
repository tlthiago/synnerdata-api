import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Length,
  IsOptional,
  IsDateString,
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
  @IsDateString()
  @IsNotEmpty()
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
  advogadoReclamante?: string;

  @ApiProperty({ description: 'Advogado do reclamado.' })
  @IsString()
  @IsOptional()
  advogadoReclamado?: string;

  @ApiProperty({ description: 'Descrição da ação.' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ description: 'Valor da causa.' })
  @IsNumber()
  @IsOptional()
  valorCausa?: number;

  @ApiProperty({ description: 'Andamento do processo.' })
  @IsString()
  @IsOptional()
  andamento?: string;

  @ApiProperty({ description: 'Decisões e sentenças.' })
  @IsString()
  @IsOptional()
  decisao?: string;

  @ApiProperty({ description: 'Data de conclusão.' })
  @IsDateString()
  @IsOptional()
  dataConclusao?: string;

  @ApiProperty({ description: 'Recursos interpostos.' })
  @IsString()
  @IsOptional()
  recursos?: string;

  @ApiProperty({ description: 'Custas e despesas.' })
  @IsNumber()
  @IsOptional()
  custasDespesas?: number;

  @ApiProperty({ description: 'Data do conhecimento.' })
  @IsDateString()
  @IsNotEmpty()
  dataConhecimento: string;
}
