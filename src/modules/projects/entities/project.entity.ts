import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../config/database/entities/base.entity';
import { Company } from '../../../modules/companies/entities/company.entity';
import { Employee } from '../../../modules/employees/entities/employee.entity';

@Entity('projetos')
export class Project extends BaseEntity {
  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @Column({ name: 'descricao', type: 'varchar', length: 255 })
  descricao: string;

  @Column({ name: 'data_inicio', type: 'timestamptz' })
  dataInicio: Date;

  @Column({ name: 'cno', type: 'varchar', length: 12 })
  cno: string;

  @ManyToOne(() => Company, (company) => company.projetos)
  empresa: Company;

  @OneToMany(() => Employee, (employee) => employee.projetos)
  funcionarios: Employee[];
}
