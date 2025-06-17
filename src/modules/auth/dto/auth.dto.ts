import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class AuthDto {
  @ApiProperty({ description: 'Nome de usuário para autenticação.' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Senha do usuário para autenticação.' })
  @IsString()
  @IsNotEmpty()
  senha: string;
}
