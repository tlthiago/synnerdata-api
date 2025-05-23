import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Funcao } from '../entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({ description: 'Nome do usuário.' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ description: 'Função do usuário.', enum: Funcao })
  @IsEnum(Funcao)
  @IsOptional()
  funcao?: Funcao;
}
