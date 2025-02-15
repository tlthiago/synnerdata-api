import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../config/database/entities/base.entity';
import { Employee } from '../../../modules/employees/entities/employee.entity';

@Entity('faltas')
export class Absence extends BaseEntity {
  @Column({ name: 'data', type: 'date' })
  data: Date;

  @Column({ name: 'motivo', type: 'varchar', length: 255 })
  motivo: string;

  @ManyToOne(() => Employee, (employee) => employee.faltas)
  funcionario: Employee;
}
