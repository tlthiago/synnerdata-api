import {
  IsString,
  IsInt,
  //IsDate,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsNotEmpty,
  Matches,
  Length,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ContractType {
  CLT = 'CLT',
  PJ = 'PJ',
}
export class CreateEmployeeDto {
  @ApiProperty({ description: 'Nome completo do empregado' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ description: 'CPF do empregado' })
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({ description: 'Data de nascimento do empregado' })
  //@IsDate()
  @IsNotEmpty()
  dataNascimento: Date;

  @ApiProperty({ description: 'Cargo ou função do empregado' })
  @IsString()
  @IsNotEmpty()
  cargo: string;

  @ApiProperty({ description: 'Setor do empregado na empresa' })
  @IsString()
  @IsNotEmpty()
  setor: string;

  @ApiProperty({
    description: 'Tipo de contrato do empregado',
    enum: ContractType,
  })
  @IsEnum(ContractType)
  @IsNotEmpty()
  tipoContrato: ContractType;

  @ApiProperty({ description: 'Salário do empregado' })
  @IsInt()
  @IsNotEmpty()
  salario: number;

  @ApiProperty({
    description: 'Telefone de contato do empregado',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber(null)
  telefone?: string;

  @ApiProperty({
    description: 'Informações de saúde do empregado, se aplicável',
    required: false,
  })
  @IsOptional()
  @IsString()
  informacoesSaude?: string;

  @ApiProperty({ description: 'Rua' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  rua: string;

  @ApiProperty({ description: 'Número' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  numero: string;

  @ApiProperty({ description: 'Complemento' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  complemento?: string;

  @ApiProperty({ description: 'Bairro' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  bairro: string;

  @ApiProperty({ description: 'Cidade' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  cidade: string;

  @ApiProperty({ description: 'Estado' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  estado: string;

  @ApiProperty({ description: 'CEP' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 10)
  @Matches(/^\d{5}-?\d{3}$/, {
    message: 'CEP deve estar no formato 00000-000 ou 00000000',
  })
  cep: string;

  @ApiProperty({
    description: 'Usuário responsável pela criação da Funncionário.',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
