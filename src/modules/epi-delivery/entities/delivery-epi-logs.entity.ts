import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Epi } from '../../epis/entities/epi.entity';
import { EpiDelivery } from './epi-delivery.entity';

export enum EpiDeliveryAction {
  REMOVEU = 'REMOVEU',
  ADICIONOU = 'ADICIONOU',
}

@Entity('entregas_epis_logs')
export class EpiDeliveryLogs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EpiDelivery)
  entregaDeEpi: EpiDelivery;

  @ManyToOne(() => Epi)
  epi: Epi;

  @Column({ type: 'enum', enum: EpiDeliveryAction })
  acao: EpiDeliveryAction;

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
