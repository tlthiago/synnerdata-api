import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Epi } from '../../epis/entities/epi.entity';

export enum RoleEpiAction {
  REMOVEU = 'REMOVEU',
  ADICIONOU = 'ADICIONOU',
}

@Entity('funcao_epi_logs')
export class RoleEpiLogs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Role)
  funcao: Role;

  @ManyToOne(() => Epi)
  epi: Epi;

  @Column({ type: 'enum', enum: RoleEpiAction })
  acao: RoleEpiAction;

  @Column({ name: 'descricao', type: 'varchar' })
  descricao: string;

  @Column({ name: 'criado_por', type: 'uuid' })
  criadoPor: string;

  @CreateDateColumn({
    name: 'criado_em',
    type: 'timestamptz',
  })
  readonly criadoEm: Date;
}
