import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../config/database/entities/base.entity';
import { Employee } from '../../../modules/employees/entities/employee.entity';

@Entity('ferias')
export class Vacation extends BaseEntity {
  @Column({ name: 'data_inicio', type: 'timestamptz' })
  dataInicio: Date;

  @Column({ name: 'data_fim', type: 'timestamptz' })
  dataFim: Date;

  @ManyToOne(() => Employee, (employee) => employee.ferias)
  funcionario: Employee;
}
