import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Expose, Transform } from 'class-transformer';

export class EmployeeResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Nome' })
  @Expose()
  nome: string;

  @ApiProperty({ description: 'Carteira de identidade' })
  @Expose()
  carteiraIdentidade: string;

  @ApiProperty({ description: 'CPF' })
  @Expose()
  cpf: string;

  @ApiProperty({ description: 'Sexo' })
  @Expose()
  sexo: string;

  @ApiProperty({ description: 'Data de Nascimento' })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  dataNascimento: Date;

  @ApiProperty({ description: 'Estado civil' })
  @Expose()
  estadoCivil: string;

  @ApiProperty({ description: 'Naturalidade' })
  @Expose()
  naturalidade: string;

  @ApiProperty({ description: 'Nacionalidade' })
  @Expose()
  nacionalidade: string;

  @ApiProperty({ description: 'Altura' })
  @Expose()
  altura: string;

  @ApiProperty({ description: 'Peso' })
  @Expose()
  peso: string;

  @ApiProperty({ description: 'Nome do Pai' })
  @Expose()
  nomePai: string;

  @ApiProperty({ description: 'Nome da Mãe' })
  @Expose()
  nomeMae: string;

  @ApiProperty({ description: 'Email' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Pis' })
  @Expose()
  pis: string;

  @ApiProperty({ description: 'Número da CTPS' })
  @Expose()
  ctpsNumero: string;

  @ApiProperty({ description: 'Série da CTPS' })
  @Expose()
  ctpsSerie: string;

  @ApiProperty({ description: 'Certificado de Reservista' })
  @Expose()
  certificadoReservista: string;

  @ApiProperty({ description: 'Regime de Contratação' })
  @Expose()
  regimeContratacao: string;

  @ApiProperty({ description: 'Data da Fundação' })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  dataAdmissao: Date;

  @ApiProperty({ description: 'Salário' })
  @Expose()
  salario: number;

  @ApiProperty({ description: 'Data do último ASO' })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  dataUltimoASO: Date;

  @ApiProperty({ description: 'Função' })
  @Expose()
  funcao: string;

  @ApiProperty({ description: 'Setor' })
  @Expose()
  setor: string;

  @ApiProperty({
    description: 'Data do vencimento do 1º período de experiência',
  })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  vencimentoExperiencia1: Date;

  @ApiProperty({
    description: 'Data do vencimento do 2º período de experiência',
  })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  vencimentoExperiencia2: Date;

  @ApiProperty({ description: 'Data do exame demissional' })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  dataExameDemissional: Date;

  @ApiProperty({ description: 'Centro de Custo' })
  @Expose()
  centroCusto: string;

  @ApiProperty({ description: 'Grau de Instrução' })
  @Expose()
  grauInstrucao: string;

  @ApiProperty({ description: 'Possui necessidades Especiais?' })
  @Expose()
  necessidadesEspeciais: boolean;

  @ApiProperty({ description: 'Deficiência' })
  @Expose()
  tipoDeficiencia: string;

  @ApiProperty({ description: 'Possui filhos?' })
  @Expose()
  filhos: boolean;

  @ApiProperty({ description: 'Quantidade de filhos' })
  @Expose()
  quantidadeFilhos: number;

  @ApiProperty({ description: 'Telefone' })
  @Expose()
  telefone: string;

  @ApiProperty({ description: 'Celular' })
  @Expose()
  celular: string;

  @ApiProperty({ description: 'Gestor' })
  @Expose()
  gestor: string;

  @ApiProperty({ description: 'Cbo' })
  @Expose()
  cbo: string;

  @ApiProperty({ description: 'Rua' })
  @Expose()
  rua: string;

  @ApiProperty({ description: 'Número' })
  @Expose()
  numero: string;

  @ApiProperty({ description: 'Complemento' })
  @Expose()
  complemento: string;

  @ApiProperty({ description: 'Bairro' })
  @Expose()
  bairro: string;

  @ApiProperty({ description: 'Cidade' })
  @Expose()
  cidade: string;

  @ApiProperty({ description: 'Estado' })
  @Expose()
  estado: string;

  @ApiProperty({ description: 'CEP' })
  @Expose()
  cep: string;

  @ApiProperty({ description: 'Latitude' })
  @Expose()
  latitude: string;

  @ApiProperty({ description: 'Longitude' })
  @Expose()
  longitude: string;

  @ApiProperty({ description: 'Quantidade de ônibus' })
  @Expose()
  quantidadeOnibus: number;

  @ApiProperty({ description: 'Carga horária mensal' })
  @Expose()
  cargaHoraria: string;

  @ApiProperty({ description: 'Escala de trabalho' })
  @Expose()
  escala: string;
}
