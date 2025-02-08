import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'Nome do usuário.' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ description: 'Função do usuário.' })
  @IsOptional()
  @IsString()
  funcao?: string;

  @ApiProperty({
    description: 'Usuário responsável pela atualização do usuário.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
