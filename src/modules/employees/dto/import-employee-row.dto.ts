import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  Matches,
  Length,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  RegimeContratacao,
  GrauInstrucao,
  Sexo,
  EstadoCivil,
  Escala,
} from '../enums/employees.enum';
import { IsFlexibleDate } from '../decorators/flexible-date.decorator';

export function toIsoDate(value: string): string | null {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const day = match[1].padStart(2, '0');
    const month = match[2].padStart(2, '0');
    const year = match[3];
    return `${year}-${month}-${day}`;
  }
  return null;
}

export class ImportEmployeeRowDto {
  @IsString({ message: 'O campo nome deve ser do tipo texto' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(1, 255, { message: 'Nome deve ter entre 1 e 255 caracteres' })
  nome: string;

  @IsString({
    message: 'O campo carteira de identidade deve ser do tipo texto',
  })
  @IsNotEmpty({ message: 'Carteira de identidade é obrigatória' })
  @Length(1, 14, {
    message: 'Carteira de identidade deve ter até 14 caracteres',
  })
  carteiraidentidade: string;

  @IsString({ message: 'O campo CPF deve ser do tipo texto' })
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter exatamente 11 dígitos' })
  cpf: string;

  @IsEnum(Sexo, {
    message: 'Sexo deve ser MASCULINO, FEMININO, NAO_DECLARADO ou OUTRO',
  }) // O campo sexo deve ser do tipo enum
  sexo: Sexo;

  @IsFlexibleDate({
    message:
      'Data de nascimento deve estar no formato DD/MM/YYYY ou YYYY-MM-DD e ser uma data válida',
  })
  @Transform(({ value }) => toIsoDate(value))
  datanascimento: string;

  @IsEnum(EstadoCivil, {
    message:
      'Estado civil deve ser SOLTEIRO, CASADO, DIVORCIADO, VIUVO, UNIAO_ESTAVEL ou SEPARADO',
  }) // O campo estado civil deve ser do tipo enum
  estadocivil: EstadoCivil;

  @IsString({ message: 'O campo naturalidade deve ser do tipo texto' })
  @IsNotEmpty({ message: 'Naturalidade é obrigatória' })
  @Length(1, 100, { message: 'Naturalidade deve ter até 100 caracteres' })
  naturalidade: string;

  @IsString({ message: 'O campo nacionalidade deve ser do tipo texto' })
  @IsNotEmpty({ message: 'Nacionalidade é obrigatória' })
  @Length(1, 100, { message: 'Nacionalidade deve ter até 100 caracteres' })
  nacionalidade: string;

  @IsNumber({}, { message: 'Altura deve ser um número válido' }) // O campo altura deve ser do tipo número
  @Min(0.5, { message: 'Altura deve ser no mínimo 0.5' })
  @Max(3, { message: 'Altura deve ser no máximo 3' })
  altura: number;

  @IsNumber({}, { message: 'Peso deve ser um número válido' }) // O campo peso deve ser do tipo número
  @Min(10, { message: 'Peso deve ser no mínimo 10' })
  @Max(500, { message: 'Peso deve ser no máximo 500' })
  peso: number;

  @IsString({ message: 'O campo nome do pai deve ser do tipo texto' })
  @IsOptional()
  @Length(1, 100, { message: 'Nome do pai deve ter até 100 caracteres' })
  nomepai?: string;

  @IsString({ message: 'O campo nome da mãe deve ser do tipo texto' })
  @IsNotEmpty({ message: 'Nome da mãe é obrigatório' })
  @Length(1, 100, { message: 'Nome da mãe deve ter até 100 caracteres' })
  nomemae: string;

  @IsEmail({}, { message: 'Email deve ser um endereço válido' }) // O campo email deve ser do tipo email
  @Length(1, 100, { message: 'Email deve ter até 100 caracteres' })
  email: string;

  @IsString({ message: 'O campo PIS deve ser do tipo texto' })
  @IsNotEmpty({ message: 'PIS é obrigatório' })
  @Matches(/^\d{11}$/, { message: 'PIS deve conter exatamente 11 dígitos' })
  pis: string;

  @IsString({ message: 'O campo número da CTPS deve ser do tipo texto' })
  @IsNotEmpty({ message: 'Número da CTPS é obrigatório' })
  @Length(1, 7, { message: 'Número da CTPS deve ter até 7 caracteres' })
  ctpsnumero: string;

  @IsString({ message: 'O campo série da CTPS deve ser do tipo texto' })
  @IsNotEmpty({ message: 'Série da CTPS é obrigatória' })
  @Length(1, 4, { message: 'Série da CTPS deve ter até 4 caracteres' })
  ctpsserie: string;

  @IsString({
    message: 'O campo certificado de reservista deve ser do tipo texto',
  })
  @IsNotEmpty({ message: 'Certificado de reservista é obrigatório' })
  @Length(1, 14, {
    message: 'Certificado de reservista deve ter até 14 caracteres',
  })
  certificadoreservista: string;

  @IsEnum(RegimeContratacao, {
    message: 'Regime de contratação deve ser CLT ou PJ',
  })
  regimecontratacao: RegimeContratacao;

  @IsFlexibleDate({
    message:
      'Data de admissão deve estar no formato DD/MM/YYYY ou YYYY-MM-DD e ser uma data válida',
  })
  @Transform(({ value }) => toIsoDate(value))
  dataadmissao: string;

  @IsNumber({}, { message: 'Salário deve ser um número válido' }) // O campo salário deve ser do tipo número
  @Min(0, { message: 'Salário deve ser maior que zero' })
  salario: number;

  @IsFlexibleDate({
    message:
      'Data do último ASO deve estar no formato DD/MM/YYYY ou YYYY-MM-DD e ser uma data válida',
  })
  @IsOptional()
  @Transform(({ value }) => toIsoDate(value))
  dataultimoaso?: string;

  @IsUUID('4', { message: 'O campo função deve ser um ID válido (UUID v4)' })
  @IsNotEmpty({ message: 'Função é obrigatória (ID da função)' })
  funcao: string;

  @IsUUID('4', { message: 'O campo setor deve ser um ID válido (UUID v4)' })
  @IsNotEmpty({ message: 'Setor é obrigatório (ID do setor)' })
  setor: string;

  @IsFlexibleDate({
    message:
      'Vencimento experiência 1 deve estar no formato DD/MM/YYYY ou YYYY-MM-DD e ser uma data válida',
  })
  @IsOptional()
  @Transform(({ value }) => toIsoDate(value))
  vencimentoexperiencia1?: string;

  @IsFlexibleDate({
    message:
      'Vencimento experiência 2 deve estar no formato DD/MM/YYYY ou YYYY-MM-DD e ser uma data válida',
  })
  @IsOptional()
  @Transform(({ value }) => toIsoDate(value))
  vencimentoexperiencia2?: string;

  @IsFlexibleDate({
    message:
      'Data exame admissional deve estar no formato DD/MM/YYYY ou YYYY-MM-DD e ser uma data válida',
  })
  @IsOptional()
  @Transform(({ value }) => toIsoDate(value))
  dataexameadmissional?: string;

  @IsFlexibleDate({
    message:
      'Data exame demissional deve estar no formato DD/MM/YYYY ou YYYY-MM-DD e ser uma data válida',
  })
  @IsOptional()
  @Transform(({ value }) => toIsoDate(value))
  dataexamedemissional?: string;

  @IsUUID('4', {
    message: 'O campo centrocusto deve ser um ID válido (UUID v4)',
  })
  @IsOptional()
  centrocusto?: string;

  @IsEnum(GrauInstrucao, {
    message:
      'Grau de instrução deve ser FUNDAMENTAL, MEDIO, SUPERIOR, POS_GRADUACAO, MESTRADO ou DOUTORADO',
  })
  grauinstrucao: GrauInstrucao;

  @IsBoolean({ message: 'Necessidades especiais deve ser true ou false' }) // O campo necessidades especiais deve ser do tipo booleano
  necessidadesespeciais: boolean;

  @IsString({ message: 'O campo tipo de deficiência deve ser do tipo texto' })
  @IsOptional()
  @Length(1, 255, {
    message: 'Tipo de deficiência deve ter até 255 caracteres',
  })
  tipodeficiencia?: string;

  @IsBoolean({ message: 'Filhos deve ser true ou false' }) // O campo filhos deve ser do tipo booleano
  filhos: boolean;

  @IsNumber({}, { message: 'Quantidade de filhos deve ser um número válido' }) // O campo quantidade de filhos deve ser do tipo número
  @IsOptional()
  @Min(0, { message: 'Quantidade de filhos deve ser maior ou igual a zero' })
  quantidadefilhos?: number;

  @IsBoolean({ message: 'Filhos abaixo de 21 deve ser true ou false' }) // O campo filhos abaixo de 21 deve ser do tipo booleano
  @IsOptional()
  filhosabaixode21?: boolean;

  @IsString({ message: 'O campo telefone deve ser do tipo texto' })
  @IsOptional()
  @Length(1, 20, { message: 'Telefone deve ter até 20 caracteres' })
  telefone?: string;

  @IsString({ message: 'O campo celular deve ser do tipo texto' })
  @IsNotEmpty({ message: 'Celular é obrigatório' })
  @Length(1, 20, { message: 'Celular deve ter até 20 caracteres' })
  celular: string;

  @IsString({ message: 'O campo gestor deve ser do tipo texto' })
  @IsNotEmpty({ message: 'Gestor é obrigatório' })
  @Length(1, 255, { message: 'Gestor deve ter até 255 caracteres' })
  gestor: string;

  @IsUUID('4', { message: 'O campo CBO deve ser um ID válido (UUID v4)' })
  @IsNotEmpty({ message: 'CBO é obrigatório (ID do CBO)' })
  cbo: string;

  @IsString({ message: 'O campo rua deve ser do tipo texto' })
  @IsNotEmpty({ message: 'Rua é obrigatória' })
  @Length(1, 255, { message: 'Rua deve ter até 255 caracteres' })
  rua: string;

  @IsString({ message: 'O campo número deve ser do tipo texto' })
  @IsNotEmpty({ message: 'Número é obrigatório' })
  @Length(1, 10, { message: 'Número deve ter até 10 caracteres' })
  numero: string;

  @IsString({ message: 'O campo complemento deve ser do tipo texto' })
  @IsOptional()
  @Length(1, 100, { message: 'Complemento deve ter até 100 caracteres' })
  complemento?: string;

  @IsString({ message: 'O campo bairro deve ser do tipo texto' })
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  @Length(1, 100, { message: 'Bairro deve ter até 100 caracteres' })
  bairro: string;

  @IsString({ message: 'O campo cidade deve ser do tipo texto' })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @Length(1, 100, { message: 'Cidade deve ter até 100 caracteres' })
  cidade: string;

  @IsString({ message: 'O campo estado deve ser do tipo texto' })
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @Length(2, 2, { message: 'Estado deve ter exatamente 2 caracteres' })
  estado: string;

  @IsString({ message: 'O campo CEP deve ser do tipo texto' })
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @Matches(/^\d{8}$/, { message: 'CEP deve conter exatamente 8 dígitos' })
  cep: string;

  @IsNumber({}, { message: 'Latitude deve ser um número válido' }) // O campo latitude deve ser do tipo número
  @IsOptional()
  latitude?: number;

  @IsNumber({}, { message: 'Longitude deve ser um número válido' }) // O campo longitude deve ser do tipo número
  @IsOptional()
  longitude?: number;

  @IsNumber({}, { message: 'Quantidade de ônibus deve ser um número válido' }) // O campo quantidade de ônibus deve ser do tipo número
  @Min(0, { message: 'Quantidade de ônibus deve ser maior ou igual a zero' })
  quantidadeonibus: number;

  @IsNumber({}, { message: 'Carga horária deve ser um número válido' }) // O campo carga horária deve ser do tipo número
  @Min(1, { message: 'Carga horária deve ser maior que zero' })
  cargahoraria: number;

  @IsEnum(Escala, {
    message: 'Escala deve ser DOZE_TRINTA_SEIS, SEIS_UM ou QUATRO_TRES',
  }) // O campo escala deve ser do tipo enum
  escala: Escala;

  @IsNumber({}, { message: 'Valor alimentação deve ser um número válido' }) // O campo valor alimentação deve ser do tipo número
  @Min(0, { message: 'Valor alimentação deve ser maior ou igual a zero' })
  valoralimentacao: number;

  @IsNumber({}, { message: 'Valor transporte deve ser um número válido' }) // O campo valor transporte deve ser do tipo número
  @Min(0, { message: 'Valor transporte deve ser maior ou igual a zero' })
  valortransporte: number;
}
