import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateEpiDto {
  @ApiProperty({ description: 'Nome do cbo.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  nome: string;

  @ApiProperty({ description: 'Descrição do cbo.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  descricao: string;

  @ApiProperty({ description: 'Lista de equipamentos do cbo.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  equipamentos: string;
}
