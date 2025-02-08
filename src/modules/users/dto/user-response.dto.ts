import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UsersResponseDto {
  @ApiProperty({ description: 'ID do usuário.' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Nome do usuário.' })
  @Expose()
  nome: string;

  @ApiProperty({ description: 'Email do usuário.' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Função do usuário.' })
  @Expose()
  funcao: string;
}
