import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../config/database/entities/base.entity';
import { Employee } from '../../../modules/employees/entities/employee.entity';

@Entity('acoes_trabalhistas')
export class LaborAction extends BaseEntity {
  @Column({ name: 'numero_processo' })
  numeroProcesso: string;

  @Column({ name: 'tribunal' })
  tribunal: string;

  @Column({ name: 'data_ajuizamento', type: 'timestamptz' })
  dataAjuizamento: Date;

  @Column({ name: 'reclamante' })
  reclamante: string;

  @Column({ name: 'reclamado' })
  reclamado: string;

  @Column({ name: 'advogado_reclamante', nullable: true })
  advogadoReclamante: string;

  @Column({ name: 'advogado_reclamado', nullable: true })
  advogadoReclamado: string;

  @Column({ name: 'descricao', type: 'text' })
  descricao: string;

  @Column({ name: 'valor_causa', type: 'numeric', nullable: true })
  valorCausa: number;

  @Column({ name: 'andamento', nullable: true })
  andamento: string;

  @Column({ name: 'decisao', type: 'text', nullable: true })
  decisao: string;

  @Column({ name: 'data_conclusao', type: 'timestamptz', nullable: true })
  dataConclusao: Date;

  @Column({ name: 'recursos', type: 'text', nullable: true })
  recursos: string;

  @Column({ name: 'custas_despesas', type: 'numeric', nullable: true })
  custasDespesas: number;

  @Column({ name: 'data_conhecimento', type: 'timestamptz' })
  dataConhecimento: Date;

  @ManyToOne(() => Employee, (employee) => employee.acoesTrabalhistas)
  funcionario: Employee;
}
