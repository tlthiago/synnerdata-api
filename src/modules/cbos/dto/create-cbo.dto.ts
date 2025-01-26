import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateCboDto {
  @ApiProperty({ description: 'Nome do cbo.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  nome: string;

  @ApiProperty({
    description: 'Usuário responsável pela criação do cbo.',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
