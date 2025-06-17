import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../config/database/entities/base.entity';
import { Employee } from '../../../modules/employees/entities/employee.entity';

@Entity('atestados')
export class MedicalCertificate extends BaseEntity {
  @Column({ name: 'data_inicio', type: 'date' })
  dataInicio: Date;

  @Column({ name: 'data_fim', type: 'date' })
  dataFim: Date;

  @Column({ name: 'motivo', type: 'varchar', length: 255 })
  motivo: string;

  @ManyToOne(() => Employee, (employee) => employee.atestados)
  funcionario: Employee;
}
