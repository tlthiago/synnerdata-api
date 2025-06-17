import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ description: 'Nome do projeto.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  nome: string;

  @ApiProperty({ description: 'Descrição do projeto.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  descricao: string;

  @ApiProperty({ description: 'Data de início do projeto.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  dataInicio: string;

  @ApiProperty({ description: 'Número do CNO do projeto.' })
  @IsString()
  @IsNotEmpty()
  @Length(12, 12)
  cno: string;
}
