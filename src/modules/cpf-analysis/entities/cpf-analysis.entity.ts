import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../config/database/entities/base.entity';
import { Employee } from '../../../modules/employees/entities/employee.entity';

@Entity('analise_de_cpf')
export class CpfAnalysis extends BaseEntity {
  @Column({ name: 'descricao', type: 'varchar', length: 255 })
  descricao: string;

  @ManyToOne(() => Employee, (employee) => employee.analisesDeCpf)
  funcionario: Employee;
}
