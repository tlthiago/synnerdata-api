import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Length,
  Matches,
  IsPhoneNumber,
  IsEmail,
  IsPostalCode,
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

  @ApiProperty({ description: 'Rua' })
  @IsString()
  @Length(1, 255)
  rua: string;

  @ApiProperty({ description: 'Número.' })
  @IsString()
  @Length(1, 10)
  numero: string;

  @ApiProperty({ description: 'Complemento.' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  complemento?: string;

  @ApiProperty({ description: 'Bairro.' })
  @IsString()
  @Length(1, 100)
  bairro: string;

  @ApiProperty({ description: 'Cidade.' })
  @IsString()
  @Length(1, 100)
  cidade: string;

  @ApiProperty({ description: 'Estado.' })
  @IsString()
  @Length(2, 2)
  estado: string;

  @ApiProperty({ description: 'CEP.' })
  @IsPostalCode('BR', {
    message: 'CEP deve estar no formato 00000-000 ou 00000000',
  })
  cep: string;
}
