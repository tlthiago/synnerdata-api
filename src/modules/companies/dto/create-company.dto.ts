import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUrl,
  Length,
  Matches,
  IsEmail,
  IsPhoneNumber,
  IsPostalCode,
} from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Razão social.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  razaoSocial: string;

  @ApiProperty({ description: 'Nome fantasia.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  nomeFantasia: string;

  @ApiProperty({ description: 'CNPJ.' })
  @IsString()
  @IsNotEmpty()
  @Length(14, 14)
  @Matches(/^\d+$/, { message: 'CNPJ deve conter apenas números' })
  cnpj: string;

  @ApiProperty({ description: 'Rua' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  rua: string;

  @ApiProperty({ description: 'Número.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  numero: string;

  @ApiProperty({ description: 'Complemento.' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  complemento?: string;

  @ApiProperty({ description: 'Bairro.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  bairro: string;

  @ApiProperty({ description: 'Cidade.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  cidade: string;

  @ApiProperty({ description: 'Estado.' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  estado: string;

  @ApiProperty({ description: 'CEP.' })
  @IsPostalCode('BR', {
    message: 'CEP deve estar no formato 00000-000 ou 00000000',
  })
  cep: string;

  @ApiProperty({ description: 'Data da Fundação.' })
  @IsString()
  @IsNotEmpty()
  dataFundacao: Date;

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

  @ApiProperty({ description: 'Faturamento.' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  faturamento: number;

  @ApiProperty({ description: 'Regime Tributário.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  regimeTributario: string;

  @ApiProperty({ description: 'Inscrição Estadual.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  inscricaoEstadual: string;

  @ApiProperty({ description: 'CNAE Principal.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  cnaePrincipal: string;

  @ApiProperty({ description: 'Segmento.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  segmento: string;

  @ApiProperty({ description: 'Ramo de atuação.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  ramoAtuacao: string;

  @ApiProperty({ description: 'Logotipo.' })
  @IsUrl()
  @IsOptional()
  @Length(1, 500)
  logoUrl?: string;
}
