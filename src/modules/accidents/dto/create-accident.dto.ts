import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateAccidentDto {
  @ApiProperty({ description: 'Descrição do acidente.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  descricao: string;

  @ApiProperty({ description: 'Data do acidente.' })
  @IsDateString()
  @IsNotEmpty()
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
}
