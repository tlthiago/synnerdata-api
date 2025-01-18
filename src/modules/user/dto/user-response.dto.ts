import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'ID do usuário.' })
  id: number;

  @ApiProperty({ description: 'Nome do usuário.' })
  name: string;

  @ApiProperty({ description: 'Email do usuário.' })
  email: string;

  @ApiProperty({ description: 'Função do usuário.' })
  role: string;
}
