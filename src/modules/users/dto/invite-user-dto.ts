import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { Funcao } from '../entities/user.entity';

export class InviteUserDto {
  @ApiProperty({ description: 'Email do usuário.' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Função do usuário.' })
  @IsEnum(Funcao)
  @IsNotEmpty()
  funcao: string;
}
