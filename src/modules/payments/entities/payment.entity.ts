import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('intencoes_de_pagamento')
export class PaymentIntent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome_fantasia', type: 'varchar', length: 255 })
  nomeFantasia: string;

  @Column({ name: 'razao_social', type: 'varchar', length: 255 })
  razaoSocial: string;

  @Column({ name: 'cnpj', type: 'varchar', length: 14 })
  cnpj: string;

  @Column({ name: 'email', type: 'varchar', length: 100 })
  email: string;

  @Column({ name: 'telefone', type: 'varchar', length: 20, nullable: true })
  telefone?: string;

  @Column({ name: 'celular', type: 'varchar', length: 20 })
  celular: string;

  @Column({ name: 'tipo_plano', type: 'varchar' })
  tipoPlano: string;

  @Column({ name: 'quantidade_funcionarios', type: 'varchar' })
  quantidadeFuncionarios: string;

  @Column({ name: 'preco', type: 'numeric', precision: 10, scale: 2 })
  preco: number;

  @Column({ name: 'pagarme_id', type: 'varchar' })
  pagarmeId: string;

  @Column({
    default: 'pending',
  })
  status: 'pending' | 'paid';

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
}
