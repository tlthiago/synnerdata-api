import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Company } from '../../../modules/companies/entities/company.entity';

@Entity('setores')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

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

  @ManyToOne(() => Company, (company) => company.setores)
  empresa: Company;
}
