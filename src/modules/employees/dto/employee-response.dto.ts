import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Expose, Transform, Type } from 'class-transformer';
import {
  Escala,
  EstadoCivil,
  GrauInstrucao,
  RegimeContratacao,
  Sexo,
  StatusFuncionario,
} from '../enums/employees.enum';
import { RoleShortDto } from '../../roles/dto/role-short.dto';
import { DepartmentShortDto } from '../../departments/dto/department-short.dto';
import { CostCenterShortDto } from '../../cost-centers/dto/cost-center-short.dto';
import { CboShortDto } from '../../cbos/dto/cbo-short.dto';

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

  @ApiProperty({ description: 'Sexo', enum: Sexo })
  @Expose()
  sexo: Sexo;

  @ApiProperty({ description: 'Data de Nascimento' })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  dataNascimento: string;

  @ApiProperty({ description: 'Estado civil', enum: EstadoCivil })
  @Expose()
  estadoCivil: EstadoCivil;

  @ApiProperty({ description: 'Naturalidade' })
  @Expose()
  naturalidade: string;

  @ApiProperty({ description: 'Nacionalidade' })
  @Expose()
  nacionalidade: string;

  @ApiProperty({ description: 'Altura' })
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  altura: number;

  @ApiProperty({ description: 'Peso' })
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  peso: number;

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

  @ApiProperty({
    description: 'Regime de Contratação',
    enum: RegimeContratacao,
  })
  @Expose()
  regimeContratacao: RegimeContratacao;

  @ApiProperty({ description: 'Data da Fundação' })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  dataAdmissao: string;

  @ApiProperty({ description: 'Salário' })
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  salario: number;

  @ApiProperty({ description: 'Data do último ASO' })
  @Expose()
  @Transform(({ value }) =>
    value
      ? new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
        }).format(new Date(value))
      : null,
  )
  dataUltimoASO: string;

  @ApiProperty({ type: RoleShortDto })
  @Expose()
  @Type(() => RoleShortDto)
  funcao: RoleShortDto;

  @ApiProperty({ type: DepartmentShortDto })
  @Expose()
  @Type(() => DepartmentShortDto)
  setor: DepartmentShortDto;

  @ApiProperty({
    description: 'Data do vencimento do 1º período de experiência',
  })
  @Expose()
  @Transform(({ value }) =>
    value
      ? new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
        }).format(new Date(value))
      : null,
  )
  vencimentoExperiencia1: string;

  @ApiProperty({
    description: 'Data do vencimento do 2º período de experiência',
  })
  @Expose()
  @Transform(({ value }) =>
    value
      ? new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
        }).format(new Date(value))
      : null,
  )
  vencimentoExperiencia2: string;

  @ApiProperty({ description: 'Data do exame admissional' })
  @Expose()
  @Transform(({ value }) =>
    value
      ? new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
        }).format(new Date(value))
      : null,
  )
  dataExameAdmissional: string;

  @ApiProperty({ description: 'Data do exame demissional' })
  @Expose()
  @Transform(({ value }) =>
    value
      ? new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
        }).format(new Date(value))
      : null,
  )
  dataExameDemissional: string;

  @ApiProperty({ type: CostCenterShortDto })
  @Expose()
  @Type(() => CostCenterShortDto)
  centroCusto: CostCenterShortDto;

  @ApiProperty({ description: 'Grau de Instrução', enum: GrauInstrucao })
  @Expose()
  grauInstrucao: GrauInstrucao;

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

  @ApiProperty({ description: 'Filhos abaixo de 21 anos?' })
  @Expose()
  filhosAbaixoDe21: boolean;

  @ApiProperty({ description: 'Telefone' })
  @Expose()
  telefone: string;

  @ApiProperty({ description: 'Celular' })
  @Expose()
  celular: string;

  @ApiProperty({ description: 'Gestor' })
  @Expose()
  gestor: string;

  @ApiProperty({ type: CboShortDto })
  @Expose()
  @Type(() => CboShortDto)
  cbo: CboShortDto;

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
  @Transform(({ value }) => parseFloat(value))
  latitude: number;

  @ApiProperty({ description: 'Longitude' })
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  longitude: number;

  @ApiProperty({ description: 'Quantidade de ônibus' })
  @Expose()
  quantidadeOnibus: number;

  @ApiProperty({ description: 'Carga horária mensal' })
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  cargaHoraria: number;

  @ApiProperty({ description: 'Escala de trabalho', enum: Escala })
  @Expose()
  escala: Escala;

  @ApiProperty({ description: 'Valor alimentação' })
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  valorAlimentacao: number;

  @ApiProperty({ description: 'Valor Transporte' })
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  valorTransporte: number;

  @ApiProperty({
    description: 'Status do Funcionário',
    enum: StatusFuncionario,
  })
  @Expose()
  statusFuncionario: StatusFuncionario;
}
