import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
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
import { GrauInstrucao, RegimeContratacao } from '../dto/create-employee.dto';

@Entity('funcionarios')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nome: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  funcao: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  setor: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  razao: string;

  @Column({ type: 'varchar', length: 18, nullable: false })
  cnpjContratacao: string;

  @Column({ type: 'enum', enum: RegimeContratacao, nullable: false })
  regimeContratacao: RegimeContratacao;

  @Column({ type: 'date', nullable: true })
  dataAdmissao?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  salario: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  ctpsSerie: string;

  @Column({ type: 'varchar', length: 11, nullable: false })
  cpf: string;

  @Column({ type: 'date', nullable: true })
  dataUltimoASO?: Date;

  @Column({ type: 'date', nullable: true })
  dataExameDemissional?: Date;

  @Column({ type: 'date', nullable: false })
  vencimentoPrazo1Experiencia: Date;

  @Column({ type: 'date', nullable: false })
  vencimentoPrazo2Experiencia: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  centroCusto: string;

  @Column({ type: 'enum', enum: GrauInstrucao, nullable: false })
  grauInstrucao: GrauInstrucao;

  @Column({ type: 'boolean', nullable: false })
  necessidadesEspeciais: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tipoDeficiencia?: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  sexo: string;

  @Column({ type: 'date', nullable: false })
  dataNascimento: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  estadoCivil: string;

  @Column({ type: 'boolean', nullable: false })
  processoJudicial: boolean;

  @Column({ type: 'varchar', length: 255, nullable: false })
  gestor: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  cbo: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  cep: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  rua: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  numero: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  complemento?: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  bairro: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  cidade: string;

  @Column({ type: 'varchar', length: 2, nullable: false })
  estado: string;

  @Column({ type: 'int', nullable: false })
  criadoPor: number;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  @Column({ name: 'atualizado_por', type: 'integer', nullable: true })
  atualizadoPor?: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['A', 'D', 'F', 'AF', 'FP'],
    default: 'A',
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
