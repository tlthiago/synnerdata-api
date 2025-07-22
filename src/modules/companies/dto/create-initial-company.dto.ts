import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Length,
  Matches,
  IsPhoneNumber,
  IsEmail,
  IsInt,
} from 'class-validator';

export class CreateInitialCompanyDto {
  @ApiProperty({ description: 'Razão social.' })
  @IsString()
  @Length(1, 255)
  razaoSocial: string;

  @ApiProperty({ description: 'Nome fantasia.' })
  @IsString()
  @Length(1, 255)
  nomeFantasia: string;

  @ApiProperty({ description: 'CNPJ.' })
  @IsString()
  @Length(14, 14)
  @Matches(/^\d+$/, { message: 'CNPJ deve conter apenas números' })
  cnpj: string;

  @ApiProperty({ description: 'Email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Telefone.' })
  @IsOptional()
  @IsPhoneNumber('BR')
  telefone?: string;

  @ApiProperty({ description: 'Telefone celular', type: 'string' })
  @IsString()
  @IsPhoneNumber('BR')
  celular: string;

  @ApiProperty({ description: 'Quantidade de Funcionários' })
  @IsInt()
  quantidadeFuncionarios?: number;

  @ApiProperty({ description: 'Plano' })
  @IsString()
  plano?: string;
}
