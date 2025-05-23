import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tokens_de_ativacao_de_usuarios')
export class UserActivationToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'uuid' })
  token: string;

  @Column({ name: 'expira_em', type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({
    name: 'criado_em',
    type: 'timestamptz',
  })
  readonly criadoEm: Date;
}
