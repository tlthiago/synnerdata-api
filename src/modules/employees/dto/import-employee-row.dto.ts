import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  IsBoolean,
  Matches,
  Length,
  Min,
  Max,
} from 'class-validator';
import {
  RegimeContratacao,
  GrauInstrucao,
  Sexo,
  EstadoCivil,
  Escala,
} from '../enums/employees.enum';

export class ImportEmployeeRowDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(1, 255, { message: 'Nome deve ter entre 1 e 255 caracteres' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'Carteira de identidade é obrigatória' })
  @Length(1, 14, {
    message: 'Carteira de identidade deve ter até 14 caracteres',
  })
  carteiraidentidade: string;

  @IsString()
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter exatamente 11 dígitos' })
  cpf: string;

  @IsEnum(Sexo, {
    message: 'Sexo deve ser MASCULINO, FEMININO, NAO_DECLARADO ou OUTRO',
  })
  sexo: Sexo;

  @IsDateString(
    {},
    { message: 'Data de nascimento deve estar no formato YYYY-MM-DD' },
  )
  datanascimento: string;

  @IsEnum(EstadoCivil, {
    message:
      'Estado civil deve ser SOLTEIRO, CASADO, DIVORCIADO, VIUVO, UNIAO_ESTAVEL ou SEPARADO',
  })
  estadocivil: EstadoCivil;

  @IsString()
  @IsNotEmpty({ message: 'Naturalidade é obrigatória' })
  @Length(1, 100, { message: 'Naturalidade deve ter até 100 caracteres' })
  naturalidade: string;

  @IsString()
  @IsNotEmpty({ message: 'Nacionalidade é obrigatória' })
  @Length(1, 100, { message: 'Nacionalidade deve ter até 100 caracteres' })
  nacionalidade: string;

  @IsNumber({}, { message: 'Altura deve ser um número válido' })
  @Min(0.5, { message: 'Altura deve ser no mínimo 0.5' })
  @Max(3, { message: 'Altura deve ser no máximo 3' })
  altura: number;

  @IsNumber({}, { message: 'Peso deve ser um número válido' })
  @Min(10, { message: 'Peso deve ser no mínimo 10' })
  @Max(500, { message: 'Peso deve ser no máximo 500' })
  peso: number;

  @IsString()
  @IsOptional()
  @Length(1, 100, { message: 'Nome do pai deve ter até 100 caracteres' })
  nomepai?: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome da mãe é obrigatório' })
  @Length(1, 100, { message: 'Nome da mãe deve ter até 100 caracteres' })
  nomemae: string;

  @IsEmail({}, { message: 'Email deve ser um endereço válido' })
  @Length(1, 100, { message: 'Email deve ter até 100 caracteres' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'PIS é obrigatório' })
  @Matches(/^\d{11}$/, { message: 'PIS deve conter exatamente 11 dígitos' })
  pis: string;

  @IsString()
  @IsNotEmpty({ message: 'Número da CTPS é obrigatório' })
  @Length(1, 7, { message: 'Número da CTPS deve ter até 7 caracteres' })
  ctpsnumero: string;

  @IsString()
  @IsNotEmpty({ message: 'Série da CTPS é obrigatória' })
  @Length(1, 4, { message: 'Série da CTPS deve ter até 4 caracteres' })
  ctpsserie: string;

  @IsString()
  @IsNotEmpty({ message: 'Certificado de reservista é obrigatório' })
  @Length(1, 14, {
    message: 'Certificado de reservista deve ter até 14 caracteres',
  })
  certificadoreservista: string;

  @IsEnum(RegimeContratacao, {
    message: 'Regime de contratação deve ser CLT ou PJ',
  })
  regimecontratacao: RegimeContratacao;

  @IsDateString(
    {},
    { message: 'Data de admissão deve estar no formato YYYY-MM-DD' },
  )
  dataadmissao: string;

  @IsNumber({}, { message: 'Salário deve ser um número válido' })
  @Min(0, { message: 'Salário deve ser maior que zero' })
  salario: number;

  @IsDateString(
    {},
    { message: 'Data do último ASO deve estar no formato YYYY-MM-DD' },
  )
  @IsOptional()
  dataultimoaso?: string;

  @IsString()
  @IsNotEmpty({ message: 'Função é obrigatória (ID da função)' })
  funcao: string;

  @IsString()
  @IsNotEmpty({ message: 'Setor é obrigatório (ID do setor)' })
  setor: string;

  @IsDateString(
    {},
    { message: 'Vencimento experiência 1 deve estar no formato YYYY-MM-DD' },
  )
  @IsOptional()
  vencimentoexperiencia1?: string;

  @IsDateString(
    {},
    { message: 'Vencimento experiência 2 deve estar no formato YYYY-MM-DD' },
  )
  @IsOptional()
  vencimentoexperiencia2?: string;

  @IsDateString(
    {},
    { message: 'Data exame admissional deve estar no formato YYYY-MM-DD' },
  )
  @IsOptional()
  dataexameadmissional?: string;

  @IsDateString(
    {},
    { message: 'Data exame demissional deve estar no formato YYYY-MM-DD' },
  )
  @IsOptional()
  dataexamedemissional?: string;

  @IsString()
  @IsOptional()
  centrocusto?: string;

  @IsEnum(GrauInstrucao, {
    message:
      'Grau de instrução deve ser FUNDAMENTAL, MEDIO, SUPERIOR, POS_GRADUACAO, MESTRADO ou DOUTORADO',
  })
  grauinstrucao: GrauInstrucao;

  @IsBoolean({ message: 'Necessidades especiais deve ser true ou false' })
  necessidadesespeciais: boolean;

  @IsString()
  @IsOptional()
  @Length(1, 255, {
    message: 'Tipo de deficiência deve ter até 255 caracteres',
  })
  tipodeficiencia?: string;

  @IsBoolean({ message: 'Filhos deve ser true ou false' })
  filhos: boolean;

  @IsNumber({}, { message: 'Quantidade de filhos deve ser um número válido' })
  @IsOptional()
  @Min(0, { message: 'Quantidade de filhos deve ser maior ou igual a zero' })
  quantidadefilhos?: number;

  @IsBoolean({ message: 'Filhos abaixo de 21 deve ser true ou false' })
  @IsOptional()
  filhosabaixode21?: boolean;

  @IsString()
  @IsOptional()
  @Length(1, 20, { message: 'Telefone deve ter até 20 caracteres' })
  telefone?: string;

  @IsString()
  @IsNotEmpty({ message: 'Celular é obrigatório' })
  @Length(1, 20, { message: 'Celular deve ter até 20 caracteres' })
  celular: string;

  @IsString()
  @IsNotEmpty({ message: 'Gestor é obrigatório' })
  @Length(1, 255, { message: 'Gestor deve ter até 255 caracteres' })
  gestor: string;

  @IsString()
  @IsNotEmpty({ message: 'CBO é obrigatório (ID do CBO)' })
  cbo: string;

  @IsString()
  @IsNotEmpty({ message: 'Rua é obrigatória' })
  @Length(1, 255, { message: 'Rua deve ter até 255 caracteres' })
  rua: string;

  @IsString()
  @IsNotEmpty({ message: 'Número é obrigatório' })
  @Length(1, 10, { message: 'Número deve ter até 10 caracteres' })
  numero: string;

  @IsString()
  @IsOptional()
  @Length(1, 100, { message: 'Complemento deve ter até 100 caracteres' })
  complemento?: string;

  @IsString()
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  @Length(1, 100, { message: 'Bairro deve ter até 100 caracteres' })
  bairro: string;

  @IsString()
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @Length(1, 100, { message: 'Cidade deve ter até 100 caracteres' })
  cidade: string;

  @IsString()
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @Length(2, 2, { message: 'Estado deve ter exatamente 2 caracteres' })
  estado: string;

  @IsString()
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @Matches(/^\d{8}$/, { message: 'CEP deve conter exatamente 8 dígitos' })
  cep: string;

  @IsNumber({}, { message: 'Latitude deve ser um número válido' })
  @IsOptional()
  latitude?: number;

  @IsNumber({}, { message: 'Longitude deve ser um número válido' })
  @IsOptional()
  longitude?: number;

  @IsNumber({}, { message: 'Quantidade de ônibus deve ser um número válido' })
  @Min(0, { message: 'Quantidade de ônibus deve ser maior ou igual a zero' })
  quantidadeonibus: number;

  @IsNumber({}, { message: 'Carga horária deve ser um número válido' })
  @Min(1, { message: 'Carga horária deve ser maior que zero' })
  cargahoraria: number;

  @IsEnum(Escala, {
    message: 'Escala deve ser DOZE_TRINTA_SEIS, SEIS_UM ou QUATRO_TRES',
  })
  escala: Escala;

  @IsNumber({}, { message: 'Valor alimentação deve ser um número válido' })
  @Min(0, { message: 'Valor alimentação deve ser maior ou igual a zero' })
  valoralimentacao: number;

  @IsNumber({}, { message: 'Valor transporte deve ser um número válido' })
  @Min(0, { message: 'Valor transporte deve ser maior ou igual a zero' })
  valortransporte: number;
}
