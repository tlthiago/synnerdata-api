import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsEnum, IsString } from 'class-validator';
import { Funcao } from '../../../modules/users/entities/user.entity';

export class CreateInvitedUserDto {
  @ApiProperty({ description: 'Nome de usuário para autenticação.' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Senha do usuário para autenticação.' })
  @IsEnum(Funcao)
  @IsNotEmpty()
  funcao: string;

  @ApiProperty({ description: 'ID da empresa do usuário.' })
  @IsString()
  @IsNotEmpty()
  empresaId: string;
}
