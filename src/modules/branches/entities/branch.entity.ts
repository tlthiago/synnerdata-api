import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Company } from '../../../modules/companies/entities/company.entity';

@Entity('filiais')
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

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

  @Column({ name: 'telefone', type: 'varchar', length: 20, nullable: true })
  telefone: string;

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

  @ManyToOne(() => Company, (company) => company.filiais)
  empresa: Company;
}
