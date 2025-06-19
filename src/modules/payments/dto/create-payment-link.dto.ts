import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  IsOptional,
  IsIn,
  IsNumber,
  Min,
} from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty({ example: 'XYZ', description: 'Nome fantasia da empresa' })
  @IsString()
  @IsNotEmpty()
  nomeFantasia: string;

  @ApiProperty({ example: 'XYZ LTDA', description: 'Razão social da empresa' })
  @IsString()
  @IsNotEmpty()
  razaoSocial: string;

  @ApiProperty({
    example: '13576276000164',
    description: 'CNPJ da empresa (somente números)',
  })
  @IsString()
  @Length(14, 14)
  cnpj: string;

  @ApiProperty({
    example: 'cliente@empresa.com',
    description: 'E-mail de contato',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '(31) 3322-1122',
    description: 'Telefone fixo (opcional)',
  })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({
    example: '(31) 99189-7926',
    description: 'Celular de contato',
  })
  @IsString()
  @IsNotEmpty()
  celular: string;

  @ApiProperty({
    example: 'Ouro Insights',
    description: 'Tipo de plano selecionado',
    enum: ['Ouro Insights', 'Platina Vision', 'Diamante Analytics'],
  })
  @IsString()
  @IsIn(['Ouro Insights', 'Platina Vision', 'Diamante Analytics'])
  tipoPlano: string;

  @ApiProperty({
    example: '0-50',
    description: 'Faixa de quantidade de funcionários',
    enum: ['0-50', '51-100', '101-500', '500+'],
  })
  @IsString()
  @IsNotEmpty()
  quantidadeFuncionarios: string;

  @ApiProperty({
    example: 200,
    description: 'Valor final em reais (sem centavos)',
  })
  @IsNumber()
  @Min(1)
  preco: number;
}
