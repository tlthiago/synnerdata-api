import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../config/database/entities/base.entity';
import { Employee } from '../../../modules/employees/entities/employee.entity';

@Entity('acoes_trabalhistas')
export class LaborAction extends BaseEntity {
  @Column({ name: 'numero_processo', type: 'varchar' })
  numeroProcesso: string;

  @Column({ name: 'tribunal', type: 'varchar' })
  tribunal: string;

  @Column({ name: 'data_ajuizamento', type: 'date' })
  dataAjuizamento: Date;

  @Column({ name: 'reclamante', type: 'varchar' })
  reclamante: string;

  @Column({ name: 'reclamado', type: 'varchar' })
  reclamado: string;

  @Column({ name: 'advogado_reclamante', type: 'varchar', nullable: true })
  advogadoReclamante: string;

  @Column({ name: 'advogado_reclamado', type: 'varchar', nullable: true })
  advogadoReclamado: string;

  @Column({ name: 'descricao', type: 'varchar' })
  descricao: string;

  @Column({
    name: 'valor_causa',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  valorCausa: number;

  @Column({ name: 'andamento', type: 'varchar', nullable: true })
  andamento: string;

  @Column({ name: 'decisao', type: 'varchar', nullable: true })
  decisao: string;

  @Column({ name: 'data_conclusao', type: 'date', nullable: true })
  dataConclusao: Date;

  @Column({ name: 'recursos', type: 'varchar', nullable: true })
  recursos: string;

  @Column({
    name: 'custas_despesas',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  custasDespesas: number;

  @Column({ name: 'data_conhecimento', type: 'date' })
  dataConhecimento: Date;

  @ManyToOne(() => Employee, (employee) => employee.acoesTrabalhistas)
  funcionario: Employee;
}
