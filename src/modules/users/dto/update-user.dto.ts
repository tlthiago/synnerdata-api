import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'Nome do usuário.' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ description: 'Função do usuário.' })
  @IsNotEmpty()
  @IsString()
  funcao: string;

  @ApiProperty({
    description: 'Usuário responsável pela atualização do usuário.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
