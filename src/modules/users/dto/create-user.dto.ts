import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário.' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email do usuário.' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário.' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20, { message: 'A senha deve ter entre 8 e 20 caracteres.' })
  password: string;

  @ApiProperty({ description: 'Função do usuário.' })
  @IsNotEmpty()
  @IsString()
  role: string;
}
