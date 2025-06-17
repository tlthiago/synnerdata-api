import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Funcao {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  GESTOR1 = 'GESTOR_1',
  GESTOR2 = 'GESTOR_2',
  VISUALIZADOR = 'VISUALIZADOR',
}

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nome: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  senha?: string;

  @Column({ type: 'enum', enum: Funcao })
  funcao: Funcao;

  @Column({ name: 'primeiro_acesso', type: 'boolean', default: true })
  primeiroAcesso?: boolean;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['A', 'I', 'E', 'P'],
    default: 'A',
  })
  status: string;

  @Column({ name: 'criado_por', type: 'uuid', nullable: true })
  criadoPor?: string;

  @CreateDateColumn({
    name: 'criado_em',
    type: 'timestamptz',
  })
  readonly criadoEm: Date;

  @Column({ name: 'atualizado_por', type: 'uuid', nullable: true })
  atualizadoPor?: string;

  @UpdateDateColumn({
    name: 'atualizado_em',
    type: 'timestamptz',
  })
  readonly atualizadoEm?: Date;

  @Column({ type: 'uuid', nullable: true })
  empresa: string;
}
