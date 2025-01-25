import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Length,
  Matches,
} from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ description: 'Nome.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  nome: string;

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
  @IsString()
  @IsNotEmpty()
  @Length(8, 10)
  @Matches(/^\d{5}-?\d{3}$/, {
    message: 'CEP deve estar no formato 00000-000 ou 00000000',
  })
  cep: string;

  @ApiProperty({ description: 'Data da Fundação.' })
  @IsString()
  @IsNotEmpty()
  dataFundacao: Date;

  @ApiProperty({ description: 'Telefone.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  telefone: string;

  @ApiProperty({ description: 'Usuário responsável pela criação da filial.' })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
