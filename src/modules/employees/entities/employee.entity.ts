import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ContractType } from '../dto/create-employee.dto';
import { Absence } from '../../../modules/absence/entities/absence.entity';
import { MedicalCertificate } from '../../../modules/medical-certificate/entities/medical-certificate.entity';
import { Promotion } from '../../../modules/promotion/entities/promotion.entity';
import { Termination } from '../../../modules/terminations/entities/termination.entity';
import { CpfAnalysis } from '../../../modules/cpf-analysis/entities/cpf-analysis.entity';
import { Accident } from '../../../modules/accidents/entities/accident.entity';
import { Warning } from '../../../modules/warnings/entities/warning.entity';
import { LaborAction } from '../../../modules/labor-actions/entities/labor-action.entity';
import { EpiDelivery } from '../../../modules/epi-delivery/entities/epi-delivery.entity';

@Entity('funcionario')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 11, unique: true })
  cpf: string;

  @Column({ type: 'date' })
  dataNascimento: Date;

  @Column({ type: 'varchar', length: 255 })
  cargo: string;

  @Column({ type: 'varchar', length: 255 })
  setor: string;

  @Column({ type: 'enum', enum: ContractType })
  tipoContrato: ContractType;

  @Column({ type: 'int' })
  salario: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  informacoesSaude?: string;

  @Column({ type: 'varchar', length: 255 })
  rua: string;

  @Column({ type: 'varchar', length: 10 })
  numero: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  complemento?: string;

  @Column({ type: 'varchar', length: 100 })
  bairro: string;

  @Column({ type: 'varchar', length: 100 })
  cidade: string;

  @Column({ type: 'varchar', length: 2 })
  estado: string;

  @Column({ type: 'varchar', length: 10 })
  cep: string;

  @Column({ name: 'criado_por', type: 'integer' })
  criadoPor?: number;

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
}
