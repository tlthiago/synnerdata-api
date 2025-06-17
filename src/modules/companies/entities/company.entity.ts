import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../modules/users/entities/user.entity';
import { Branch } from '../../../modules/branches/entities/branch.entity';
import { Department } from '../../../modules/departments/entities/department.entity';
import { CostCenter } from '../../../modules/cost-centers/entities/cost-center.entity';
import { Cbo } from '../../../modules/cbos/entities/cbo.entity';
import { Epi } from '../../../modules/epis/entities/epi.entity';
import { Role } from '../../../modules/roles/entities/role.entity';
import { Project } from '../../../modules/projects/entities/project.entity';
import { Employee } from '../../../modules/employees/entities/employee.entity';

@Entity('empresas')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ name: 'data_fundacao', type: 'date', nullable: true })
  dataFundacao: Date;

  @Column({ name: 'email', type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ name: 'telefone', type: 'varchar', length: 20, nullable: true })
  telefone?: string;

  @Column({ name: 'celular', type: 'varchar', length: 20 })
  celular: string;

  @Column({
    name: 'faturamento',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  faturamento: number;

  @Column({
    name: 'regime_tributario',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  regimeTributario: string;

  @Column({
    name: 'inscricao_estadual',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  inscricaoEstadual: string;

  @Column({
    name: 'cnae_principal',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  cnaePrincipal: string;

  @Column({ name: 'segmento', type: 'varchar', length: 100, nullable: true })
  segmento: string;

  @Column({
    name: 'ramo_atuacao',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  ramoAtuacao: string;

  @Column({ name: 'logo_url', type: 'varchar', nullable: true })
  logoUrl?: string;

  @Column({ name: 'pb_url', type: 'varchar', nullable: true })
  pbUrl?: string;

  @Column({ name: 'qt_usuarios', type: 'int', default: 4 })
  quantidadeUsuarios?: number;

  @Column({ name: 'id_assinatura', type: 'varchar', nullable: true })
  idAssinatura?: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['A', 'I', 'E', 'P'],
    default: 'A',
  })
  status: string;

  @CreateDateColumn({
    name: 'criado_em',
    type: 'timestamptz',
  })
  readonly criadoEm: Date;

  @UpdateDateColumn({
    name: 'atualizado_em',
    type: 'timestamptz',
  })
  readonly atualizadoEm?: Date;

  @OneToMany(() => User, (user) => user.empresa)
  usuarios: User[];

  @OneToMany(() => Branch, (branch) => branch.empresa)
  filiais: Branch[];

  @OneToMany(() => Department, (department) => department.empresa)
  setores: Department[];

  @OneToMany(() => CostCenter, (costCenter) => costCenter.empresa)
  centrosDeCusto: CostCenter[];

  @OneToMany(() => Cbo, (cbo) => cbo.empresa)
  cbos: Cbo[];

  @OneToMany(() => Role, (role) => role.empresa)
  funcoes: Role[];

  @OneToMany(() => Epi, (epi) => epi.empresa)
  epis: Epi[];

  @OneToMany(() => Project, (project) => project.empresa)
  projetos: Project[];

  @OneToMany(() => Employee, (employee) => employee.empresa)
  funcionarios: Employee[];
}
