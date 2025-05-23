import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsUUID } from 'class-validator';

export class CreateUserActivationTokenDto {
  @ApiProperty({ description: 'Email do usuário.' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Token de ativação do usuário.' })
  @IsUUID()
  token: string;

  @ApiProperty({ description: 'Data de expiração do token.' })
  @IsDateString()
  expiresAt: string;
}
