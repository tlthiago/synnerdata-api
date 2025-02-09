import { User } from '../../../modules/users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
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

  @ManyToOne(() => User, { nullable: false, eager: true })
  criadoPor: User;

  @CreateDateColumn({
    name: 'criado_em',
    type: 'timestamptz',
  })
  readonly criadoEm: Date;

  @ManyToOne(() => User, { nullable: true, eager: true })
  atualizadoPor: User;

  @UpdateDateColumn({
    name: 'atualizado_em',
    type: 'timestamptz',
  })
  readonly atualizadoEm?: Date;
}
