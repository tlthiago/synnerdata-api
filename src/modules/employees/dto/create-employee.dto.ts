import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  Matches,
  Length,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum RegimeContratacao {
  CLT = 'CLT',
  PJ = 'PJ',
}

export enum GrauInstrucao {
  FUNDAMENTAL = 'Fundamental',
  MEDIO = 'Médio',
  SUPERIOR = 'Superior',
  POS_GRADUACAO = 'Pós-Graduação',
  MESTRADO = 'Mestrado',
  DOUTORADO = 'Doutorado',
}

export enum Sexo {
  MASCULINO = 'Masculino',
  FEMININO = 'Feminino',
  NAO_DECLARADO = 'Não Declarado',
  OUTRO = 'Outro',
}

export enum EstadoCivil {
  SOLTEIRO = 'Solteiro',
  CASADO = 'Casado',
  DIVORCIADO = 'Divorciado',
  VIUVO = 'Viúvo',
  UNIAO_ESTAVEL = 'União Estável',
  SEPARADO = 'Separado',
}

export enum Escala {
  DOZE_TRINTA_SEIS = '12x36',
  SEIS_UM = '6x1',
  QUATRO_TRES = '4x3',
}

export enum Status {
  ATIVO = 'Ativo',
  DEMITIDO = 'Demitido',
  AFASTADO = 'Afastado',
  EM_FERIAS = 'Em Férias',
  FERIAS_PROGRAMADA = 'Férias Programada',
}

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Nome completo do funcionário' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ description: 'Status do funcionário (Ativo, Demitido, etc.)' })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({ description: 'Função do funcionário' })
  @IsString()
  @IsNotEmpty()
  funcao: string;

  @ApiProperty({ description: 'Setor em que o funcionário trabalha' })
  @IsString()
  @IsNotEmpty()
  setor: string;

  @ApiProperty({ description: 'Razão social da empresa contratante' })
  @IsString()
  @IsNotEmpty()
  razao: string;

  @ApiProperty({ description: 'CNPJ da empresa de contratação' })
  @IsString()
  @IsNotEmpty()
  cnpjContratacao: string;

  @ApiProperty({ description: 'Regime de contratação (CLT ou PJ)' })
  @IsEnum(RegimeContratacao)
  @IsNotEmpty()
  regimeContratacao: RegimeContratacao;

  @ApiProperty({
    description: 'Data de admissão do funcionário',
    required: false,
  })
  @IsOptional()
  dataAdmissao?: string;

  @ApiProperty({ description: 'Salário do funcionário' })
  @IsNumber()
  @IsNotEmpty()
  salario: number;

  @ApiProperty({ description: 'Número da CTPS e série' })
  @IsString()
  @IsNotEmpty()
  ctpsSerie: string;

  @ApiProperty({ description: 'CPF do funcionário' })
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({ description: 'Data do último ASO', required: false })
  @IsOptional()
  dataUltimoASO?: string;

  @ApiProperty({ description: 'Data do exame demissional', required: false })
  @IsOptional()
  dataExameDemissional?: string;

  @ApiProperty({ description: 'Vencimento do primeiro prazo de experiência' })
  @IsNotEmpty()
  vencimentoPrazo1Experiencia: string;

  @ApiProperty({ description: 'Vencimento do segundo prazo de experiência' })
  @IsNotEmpty()
  vencimentoPrazo2Experiencia: string;

  @ApiProperty({ description: 'Centro de custo' })
  @IsString()
  @IsNotEmpty()
  centroCusto: string;

  @ApiProperty({ description: 'Grau de instrução do funcionário' })
  @IsEnum(GrauInstrucao)
  @IsNotEmpty()
  grauInstrucao: GrauInstrucao;

  @ApiProperty({ description: 'Se o funcionário tem necessidades especiais' })
  @IsBoolean()
  @IsNotEmpty()
  necessidadesEspeciais: boolean;

  @ApiProperty({
    description: 'Tipo de deficiência (caso aplicável)',
    required: false,
  })
  @IsString()
  @IsOptional()
  tipoDeficiencia?: string;

  @ApiProperty({ description: 'Sexo do funcionário' })
  @IsString()
  @IsNotEmpty()
  sexo: string;

  @ApiProperty({ description: 'Data de nascimento' })
  @IsNotEmpty()
  dataNascimento: string;

  @ApiProperty({ description: 'Estado civil' })
  @IsString()
  @IsNotEmpty()
  estadoCivil: string;

  @ApiProperty({ description: 'Se o funcionário tem processos judiciais' })
  @IsBoolean()
  @IsNotEmpty()
  processoJudicial: boolean;

  @ApiProperty({ description: 'Nome do gestor responsável' })
  @IsString()
  @IsNotEmpty()
  gestor: string;

  @ApiProperty({ description: 'CBO (Código Brasileiro de Ocupações)' })
  @IsString()
  @IsNotEmpty()
  cbo: string;

  @ApiProperty({ description: 'CEP' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 10)
  @Matches(/^\d{5}-?\d{3}$/, {
    message: 'CEP deve estar no formato 00000-000 ou 00000000',
  })
  cep: string;

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

  @ApiProperty({
    description: 'Usuário responsável pela criação da Funncionário.',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
