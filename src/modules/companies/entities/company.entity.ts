import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Branch } from '../../../modules/branches/entities/branch.entity';
import { Department } from '../../../modules/departments/entities/department.entity';
import { CostCenter } from '../../../modules/cost-centers/entities/cost-center.entity';

@Entity('empresas')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nome_fantasia', type: 'varchar', length: 255 })
  nomeFantasia: string;

  @Column({ name: 'razao_social', type: 'varchar', length: 255 })
  razaoSocial: string;

  @Column({ name: 'cnpj', type: 'varchar', length: 14, unique: true })
  cnpj: string;

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

  @Column({ name: 'data_fundacao', type: 'date' })
  dataFundacao: Date;

  @Column({ name: 'telefone', type: 'varchar', length: 20 })
  telefone: string;

  @Column({ name: 'faturamento', type: 'numeric', precision: 15, scale: 2 })
  faturamento: number;

  @Column({ name: 'regime_tributario', type: 'varchar', length: 50 })
  regimeTributario: string;

  @Column({ name: 'inscricao_estadual', type: 'varchar', length: 50 })
  inscricaoEstadual: string;

  @Column({ name: 'cnae_principal', type: 'varchar', length: 50 })
  cnaePrincipal: string;

  @Column({ name: 'segmento', type: 'varchar', length: 100 })
  segmento: string;

  @Column({ name: 'ramo_atuacao', type: 'varchar', length: 100 })
  ramoAtuacao: string;

  @Column({ name: 'logo_url', type: 'varchar', length: 500, nullable: true })
  logoUrl?: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['A', 'I', 'E'],
    default: 'A',
  })
  status: string;

  @Column({ name: 'criado_por', type: 'integer' })
  criadoPor?: number;

  @CreateDateColumn({
    name: 'criado_em',
    type: 'timestamptz',
  })
  readonly criadoEm: Date;

  @Column({ name: 'atualizado_por', type: 'integer', nullable: true })
  atualizadoPor?: number;

  @UpdateDateColumn({
    name: 'atualizado_em',
    type: 'timestamptz',
  })
  readonly atualizadoEm?: Date;

  @OneToMany(() => Branch, (branch) => branch.empresa)
  filiais: Branch[];

  @OneToMany(() => Department, (department) => department.empresa)
  setores: Department[];

  @OneToMany(() => CostCenter, (costCenter) => costCenter.empresa)
  centrosDeCusto: CostCenter[];
}
