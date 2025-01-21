import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'Nome do usuário.' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Função do usuário.' })
  @IsNotEmpty()
  @IsString()
  role: string;
}
