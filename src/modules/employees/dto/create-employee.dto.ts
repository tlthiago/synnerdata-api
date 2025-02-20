import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  Matches,
  Length,
  IsNumber,
  IsBoolean,
  IsLatitude,
  IsLongitude,
  IsPhoneNumber,
  IsEmail,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  RegimeContratacao,
  GrauInstrucao,
  Sexo,
  EstadoCivil,
  Escala,
} from '../enums/employees.enum';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Nome completo', type: 'string' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    description: 'Número da carteira de identidade',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  carteiraIdentidade: string;

  @ApiProperty({ description: 'CPF', type: 'string' })
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({ description: 'Sexo', enum: Sexo })
  @IsEnum(Sexo)
  @IsNotEmpty()
  sexo: Sexo;

  @ApiProperty({ description: 'Data de nascimento', type: 'string' })
  @IsDateString()
  @IsNotEmpty()
  dataNascimento: string;

  @ApiProperty({ description: 'Estado civil', enum: EstadoCivil })
  @IsEnum(EstadoCivil)
  @IsNotEmpty()
  estadoCivil: EstadoCivil;

  @ApiProperty({ description: 'Naturalidade', type: 'string' })
  @IsString()
  @IsNotEmpty()
  naturalidade: string;

  @ApiProperty({ description: 'Nacionalidade', type: 'string' })
  @IsString()
  @IsNotEmpty()
  nacionalidade: string;

  @ApiProperty({ description: 'Altura', type: 'number' })
  @IsNumber()
  @IsNotEmpty()
  altura: number;

  @ApiProperty({ description: 'Peso', type: 'number' })
  @IsNumber()
  @IsNotEmpty()
  peso: number;

  @ApiProperty({ description: 'Nome do Pai', type: 'string' })
  @IsString()
  @IsNotEmpty()
  nomePai: string;

  @ApiProperty({ description: 'Nome da mãe', type: 'string' })
  @IsString()
  @IsNotEmpty()
  nomeMae: string;

  @ApiProperty({ description: 'E-mail do funcionário', type: 'string' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Número da PIS', type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 11)
  pis: string;

  @ApiProperty({ description: 'Número da CTPS', type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 7)
  ctpsNumero: string;

  @ApiProperty({ description: 'Série da CTPS', type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 4)
  ctpsSerie: string;

  @ApiProperty({
    description: 'Número do Certificado de Reservista',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 14)
  certificadoReservista: string;

  @ApiProperty({
    description: 'Regime de contratação',
    enum: RegimeContratacao,
  })
  @IsEnum(RegimeContratacao)
  @IsNotEmpty()
  regimeContratacao: RegimeContratacao;

  @ApiProperty({ description: 'Data de admissão', type: 'string' })
  @IsDateString()
  @IsNotEmpty()
  dataAdmissao: string;

  @ApiProperty({ description: 'Salário do funcionário', type: 'number' })
  @IsNumber()
  @IsNotEmpty()
  salario: number;

  @ApiProperty({ description: 'Data do último ASO', type: 'string' })
  @IsDateString()
  @IsOptional()
  dataUltimoASO?: string;

  @ApiProperty({ description: 'Função', type: 'number' })
  @IsNumber()
  @IsNotEmpty()
  funcao: number;

  @ApiProperty({ description: 'Setor', type: 'number' })
  @IsNumber()
  @IsNotEmpty()
  setor: number;

  @ApiProperty({
    description: 'Data do vencimento do 1º período de experiência',
    type: 'string',
  })
  @IsDateString()
  @IsOptional()
  vencimentoExperiencia1?: string;

  @ApiProperty({
    description: 'Data do vencimento do 2º período de experiência',
    type: 'string',
  })
  @IsDateString()
  @IsOptional()
  vencimentoExperiencia2?: string;

  @ApiProperty({ description: 'Data do exame demissional', type: 'string' })
  @IsDateString()
  @IsOptional()
  dataExameDemissional?: string;

  @ApiProperty({ description: 'Centro de custo', type: 'number' })
  @IsNumber()
  @IsOptional()
  centroCusto?: number;

  @ApiProperty({ description: 'Grau de instrução', enum: GrauInstrucao })
  @IsEnum(GrauInstrucao)
  @IsNotEmpty()
  grauInstrucao: GrauInstrucao;

  @ApiProperty({
    description: 'Possui necessidades especiais?',
    type: 'boolean',
  })
  @IsBoolean()
  @IsNotEmpty()
  necessidadesEspeciais: boolean;

  @ApiProperty({ description: 'Deficiência', type: 'string' })
  @IsString()
  @IsOptional()
  tipoDeficiencia?: string;

  @ApiProperty({ description: 'Possui filhos?', type: 'boolean' })
  @IsBoolean()
  @IsNotEmpty()
  filhos: boolean;

  @ApiProperty({ description: 'Quantidade de filhos', type: 'number' })
  @IsNumber()
  @IsOptional()
  quantidadeFilhos?: number;

  @ApiProperty({ description: 'Telefone residencial', type: 'string' })
  @IsString()
  @IsOptional()
  @IsPhoneNumber('BR')
  telefone?: string;

  @ApiProperty({ description: 'Telefone celular', type: 'string' })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('BR')
  celular: string;

  @ApiProperty({ description: 'Gestor', type: 'string' })
  @IsString()
  @IsNotEmpty()
  gestor: string;

  @ApiProperty({ description: 'Cbo', type: 'number' })
  @IsNumber()
  @IsNotEmpty()
  cbo: number;

  @ApiProperty({ description: 'Rua', type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  rua: string;

  @ApiProperty({ description: 'Número.', type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  numero: string;

  @ApiProperty({ description: 'Complemento.', type: 'string' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  complemento?: string;

  @ApiProperty({ description: 'Bairro.', type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  bairro: string;

  @ApiProperty({ description: 'Cidade.', type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  cidade: string;

  @ApiProperty({ description: 'Estado.', type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  estado: string;

  @ApiProperty({ description: 'CEP.', type: 'string' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 10)
  @Matches(/^\d{5}-?\d{3}$/, {
    message: 'CEP deve estar no formato 00000-000 ou 00000000',
  })
  cep: string;

  @ApiProperty({
    description: 'Latitude do endereço',
    type: 'number',
    example: -19.9166813,
  })
  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude do endereço',
    type: 'number',
    example: -43.9344931,
  })
  @IsLongitude()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ description: 'Quantidade de ônibus', type: 'number' })
  @IsNumber()
  @IsOptional()
  quantidadeOnibus: number;

  @ApiProperty({ description: 'Carga horária semanal', type: 'number' })
  @IsNumber()
  @IsNotEmpty()
  cargaHoraria: number;

  @ApiProperty({ description: 'Escala de trabalho', enum: Escala })
  @IsEnum(Escala)
  @IsNotEmpty()
  escala: Escala;

  @ApiProperty({
    description: 'Usuário responsável pelo cadastro do funcionário.',
    type: 'number',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
