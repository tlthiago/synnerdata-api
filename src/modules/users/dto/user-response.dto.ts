import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Funcao } from '../entities/user.entity';

export class UsersResponseDto {
  @ApiProperty({ description: 'ID' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nome do usuário.' })
  @Expose()
  nome: string;

  @ApiProperty({ description: 'Email do usuário.' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Função do usuário.', enum: Funcao })
  @Expose()
  funcao: Funcao;

  @ApiProperty({ description: 'Status' })
  @Expose()
  status: string;

  @ApiProperty({ description: 'Criado por' })
  @Expose()
  criadoPor: string;
}
