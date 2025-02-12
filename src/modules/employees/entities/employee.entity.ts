import { Column, Entity, ManyToMany, OneToMany, ManyToOne } from 'typeorm';
import { Absence } from '../../../modules/absence/entities/absence.entity';
import { MedicalCertificate } from '../../../modules/medical-certificate/entities/medical-certificate.entity';
import { Promotion } from '../../../modules/promotion/entities/promotion.entity';
import { Termination } from '../../../modules/terminations/entities/termination.entity';
import { CpfAnalysis } from '../../../modules/cpf-analysis/entities/cpf-analysis.entity';
import { Accident } from '../../../modules/accidents/entities/accident.entity';
import { Warning } from '../../../modules/warnings/entities/warning.entity';
import { LaborAction } from '../../../modules/labor-actions/entities/labor-action.entity';
import { EpiDelivery } from '../../../modules/epi-delivery/entities/epi-delivery.entity';
import { Vacation } from '../../../modules/vacations/entities/vacation.entity';
import { Project } from '../../../modules/projects/entities/project.entity';
import { Company } from '../../../modules/companies/entities/company.entity';
import {
  Escala,
  EstadoCivil,
  GrauInstrucao,
  RegimeContratacao,
  Sexo,
  Status,
} from '../dto/create-employee.dto';
import { BaseEntity } from '../../../config/database/entities/base.entity';
import { Role } from '../../../modules/roles/entities/role.entity';
import { Department } from '../../../modules/departments/entities/department.entity';
import { CostCenter } from '../../../modules/cost-centers/entities/cost-center.entity';
import { Cbo } from '../../../modules/cbos/entities/cbo.entity';

@Entity('funcionarios')
export class Employee extends BaseEntity {
  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @Column({ name: 'nome_pai', type: 'varchar', length: 100 })
  nomePai: string;

  @Column({ name: 'nome_mae', type: 'varchar', length: 100 })
  nomeMae: string;

  @Column({ name: 'pis', type: 'varchar', length: 100 })
  pis: string;

  @Column({ name: 'carteira_identidade', type: 'varchar', length: 100 })
  carteiraIdentidade: string;

  @Column({ name: 'cpf', type: 'varchar', length: 11, unique: true })
  cpf: string;

  @Column({ name: 'certificado_reservista', type: 'varchar', length: 100 })
  certificadoReservista: string;

  @Column({ name: 'ctps_numero', type: 'varchar', length: 7 })
  ctpsNumero: string;

  @Column({ name: 'ctps_serie', type: 'varchar', length: 4 })
  ctpsSerie: string;

  @Column({ name: 'regime_contratacao', type: 'enum', enum: RegimeContratacao })
  regimeContratacao: RegimeContratacao;

  @Column({ name: 'data_admissao', type: 'timestamptz' })
  dataAdmissao: Date;

  @Column({ name: 'salario', type: 'decimal', precision: 10, scale: 2 })
  salario: number;

  @Column({ name: 'data_ultimo_aso', type: 'timestamptz', nullable: true })
  dataUltimoASO?: Date;

  @ManyToOne(() => Role, { nullable: false, eager: true })
  funcao: Role;

  @ManyToOne(() => Department, { nullable: false, eager: true })
  setor: Department;

  @Column({
    name: 'vencimento_experiencia_1',
    type: 'timestamptz',
    nullable: true,
  })
  vencimentoExperiencia1?: Date;

  @Column({
    name: 'vencimento_experiencia_2',
    type: 'timestamptz',
    nullable: true,
  })
  vencimentoExperiencia2?: Date;

  @Column({
    name: 'data_exame_demissional',
    type: 'timestamptz',
    nullable: true,
  })
  dataExameDemissional?: Date;

  @ManyToOne(() => CostCenter, { nullable: true, eager: true })
  centroCusto?: CostCenter;

  @Column({ name: 'grau_instrucao', type: 'enum', enum: GrauInstrucao })
  grauInstrucao: GrauInstrucao;

  @Column({ name: 'necessidades_especiais', type: 'boolean' })
  necessidadesEspeciais: boolean;

  @Column({
    name: 'tipo_deficiencia',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  tipoDeficiencia?: string;

  @Column({ name: 'sexo', type: 'enum', enum: Sexo })
  sexo: Sexo;

  @Column({ name: 'data_nascimento', type: 'date' })
  dataNascimento: Date;

  @Column({ name: 'estado_civil', type: 'enum', enum: EstadoCivil })
  estadoCivil: EstadoCivil;

  @Column({ name: 'filhos', type: 'boolean' })
  filhos: boolean;

  @Column({ name: 'quantidade_filhos', type: 'varchar', nullable: true })
  quantidadeFilhos?: boolean;

  @Column({ name: 'telefone', type: 'varchar', length: 20, nullable: true })
  telefone?: string;

  @Column({ name: 'celular', type: 'varchar', length: 20 })
  celular: string;

  @ManyToOne(() => LaborAction, { nullable: true, eager: true })
  processoJudicial: LaborAction;

  @Column({ name: 'gestor', type: 'varchar', length: 255 })
  gestor: string;

  @ManyToOne(() => Cbo, { nullable: false, eager: true })
  cbo: Cbo;

  @Column({ name: 'rua', type: 'varchar', length: 255 })
  rua: string;

  @Column({ name: 'numero', type: 'varchar', length: 10 })
  numero: string;

  @Column({ name: 'complemento', type: 'varchar', length: 100, nullable: true })
  complemento?: string;

  @Column({ name: 'bairro', type: 'varchar', length: 100 })
  bairro: string;

  @Column({ name: 'cidade', type: 'varchar', length: 100 })
  cidade: string;

  @Column({ name: 'estado', type: 'varchar', length: 2 })
  estado: string;

  @Column({ name: 'cep', type: 'varchar', length: 10 })
  cep: string;

  @Column({ name: 'naturalidade', type: 'varchar', length: 100 })
  naturalidade: string;

  @Column({ name: 'nacionalidade', type: 'varchar', length: 100 })
  nacionalidade: string;

  @Column({ name: 'altura', type: 'varchar', length: 100 })
  altura: string;

  @Column({ name: 'peso', type: 'varchar', length: 100 })
  peso: string;

  @Column({ name: 'latitude', type: 'varchar', length: 100 })
  latitude: string;

  @Column({ name: 'longitude', type: 'varchar', length: 100 })
  longitude: string;

  @Column({ name: 'quantidade_onibus', type: 'varchar', length: 100 })
  quantidadeOnibus: string;

  @Column({
    name: 'carga_horaria',
    type: 'integer',
  })
  cargaHoraria: number;

  @Column({
    name: 'escala',
    type: 'enum',
    enum: Escala,
  })
  escala: Escala;

  @Column({
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.ATIVO,
  })
  status: string;

  @OneToMany(() => Absence, (absence) => absence.funcionario)
  faltas: Absence[];

  @OneToMany(
    () => MedicalCertificate,
    (medicalCertificate) => medicalCertificate.funcionario,
  )
  atestados: MedicalCertificate[];

  @OneToMany(() => Promotion, (promotion) => promotion.funcionario)
  promocoes: Promotion[];

  @OneToMany(() => Termination, (termination) => termination.funcionario)
  demissoes: Termination[];

  @OneToMany(() => CpfAnalysis, (CpfAnalysis) => CpfAnalysis.funcionario)
  analisesDeCpf: CpfAnalysis[];

  @OneToMany(() => Accident, (accident) => accident.funcionario)
  acidentes: Accident[];

  @OneToMany(() => Warning, (warning) => warning.funcionario)
  advertencias: Warning[];

  @OneToMany(() => LaborAction, (laborAction) => laborAction.funcionario)
  acoesTrabalhistas: LaborAction[];

  @OneToMany(() => EpiDelivery, (epiDelivery) => epiDelivery.funcionario)
  entregasDeEpis: EpiDelivery[];

  @OneToMany(() => Vacation, (vacation) => vacation.funcionario)
  ferias: Vacation[];

  @ManyToMany(() => Project, (project) => project.funcionarios)
  projetos: Project[];

  @ManyToOne(() => Company, (company) => company.funcionarios)
  empresa: Company;
}
