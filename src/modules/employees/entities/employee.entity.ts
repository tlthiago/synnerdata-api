import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import {
  GrauInstrucao,
  RegimeContratacao,
  Status,
} from '../dto/create-employee.dto';
import { Company } from '../../../modules/companies/entities/company.entity';
import { Project } from '../../../modules/projects/entities/project.entity';

@Entity('funcionarios')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nome: string;

  @Column({ type: 'enum', enum: Status, nullable: false })
  status: Status;

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

  @ManyToOne(() => Company, (company) => company.funcionarios)
  empresa: Company;

  @ManyToOne(() => Project, (project) => project.funcionarios)
  projetos: Project;
}
