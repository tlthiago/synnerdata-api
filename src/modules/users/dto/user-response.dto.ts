import { ApiProperty } from '@nestjs/swagger';

export class UsersResponseDto {
  @ApiProperty({ description: 'ID do usuário.' })
  id: number;

  @ApiProperty({ description: 'Nome do usuário.' })
  nome: string;

  @ApiProperty({ description: 'Email do usuário.' })
  email: string;

  @ApiProperty({ description: 'Função do usuário.' })
  funcao: string;
}
