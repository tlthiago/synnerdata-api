import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Length,
  IsOptional,
} from 'class-validator';

export class CreateAccidentDto {
  @ApiProperty({ description: 'Descrição do acidente.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  descricao: string;

  @ApiProperty({ description: 'Data do acidente.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  data: string;

  @ApiProperty({ description: 'Natureza do acidente.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  natureza: string;

  @ApiProperty({ description: 'Número do CAT.' })
  @IsString()
  @IsOptional()
  cat?: string;

  @ApiProperty({ description: 'Medidas tomadas após o acidente.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  medidasTomadas: string;

  @ApiProperty({
    description: 'Usuário responsável pelo cadastro do acidente.',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
