import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../config/database/entities/base.entity';
import { Employee } from '../../../modules/employees/entities/employee.entity';

@Entity('demissoes')
export class Termination extends BaseEntity {
  @Column({ name: 'data', type: 'date' })
  data: Date;

  @Column({ name: 'motivo_interno', type: 'varchar', length: 255 })
  motivoInterno: string;

  @Column({ name: 'motivo_trabalhista', type: 'varchar', length: 255 })
  motivoTrabalhista: string;

  @Column({ name: 'acao_trabalhista', type: 'varchar', length: 255 })
  acaoTrabalhista: string;

  @Column({ name: 'forma_demissao', type: 'varchar', length: 255 })
  formaDemissao: string;

  @ManyToOne(() => Employee, (employee) => employee.demissoes)
  funcionario: Employee;
}
