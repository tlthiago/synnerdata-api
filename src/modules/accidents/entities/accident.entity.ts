import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../config/database/entities/base.entity';
import { Employee } from '../../../modules/employees/entities/employee.entity';

@Entity('acidentes')
export class Accident extends BaseEntity {
  @Column({ name: 'descricao', type: 'varchar', length: 255 })
  descricao: Date;

  @Column({ name: 'data', type: 'timestamptz' })
  data: Date;

  @Column({ name: 'natureza', type: 'varchar', length: 255 })
  natureza: string;

  @Column({ name: 'cat', type: 'varchar', length: 15 })
  cat: string;

  @Column({ name: 'medidasTomadas', type: 'varchar', length: 255 })
  medidasTomadas: string;

  @ManyToOne(() => Employee, (employee) => employee.acidentes)
  funcionario: Employee;
}
