import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateInitialUserDto {
  @ApiProperty({ description: 'Nome do usuário.' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ description: 'Email do usuário.' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'ID da empresa' })
  @IsNotEmpty()
  @IsUUID()
  empresaId: string;
}
