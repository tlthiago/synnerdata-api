import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Nome de usuário para autenticação.' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Senha para autenticação.' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
