import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class ActivateAccountDto {
  @ApiProperty({ description: 'Nome do usuário.' })
  @IsString()
  nome: string;

  @ApiProperty({ description: 'Email do usuário.' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário.' })
  @IsStrongPassword()
  password: string;

  @ApiProperty({ description: 'Token de ativação do usuário.' })
  @IsUUID()
  activationToken: string;
}
