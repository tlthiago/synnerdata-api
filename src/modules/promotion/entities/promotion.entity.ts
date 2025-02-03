import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../config/database/entities/base.entity';
import { Employee } from '../../../modules/employees/entities/employee.entity';
import { Role } from '../../../modules/roles/entities/role.entity';

@Entity('promocoes')
export class Promotion extends BaseEntity {
  @ManyToOne(() => Role, (role) => role.promocoes)
  funcao: Role;

  @Column({ name: 'salario', type: 'timestamptz' })
  salario: number;

  @Column({ name: 'data', type: 'timestamptz' })
  data: Date;

  @ManyToOne(() => Employee, (employee) => employee.atestados)
  funcionario: Employee;
}
