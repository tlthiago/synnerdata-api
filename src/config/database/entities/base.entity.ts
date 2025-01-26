import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
}
