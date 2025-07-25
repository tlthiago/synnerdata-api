import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

import { BaseEntity } from '../../../config/database/entities/base.entity';
import { Company } from '../../../modules/companies/entities/company.entity';
import { Employee } from '../../../modules/employees/entities/employee.entity';

@Entity('projetos')
export class Project extends BaseEntity {
  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @Column({ name: 'descricao', type: 'varchar', length: 255 })
  descricao: string;

  @Column({ name: 'data_inicio', type: 'date' })
  dataInicio: Date;

  @Column({ name: 'cno', type: 'varchar', length: 12 })
  cno: string;

  @ManyToOne(() => Company, (company) => company.projetos)
  empresa: Company;

  @ManyToMany(() => Employee, (employee) => employee.projetos, {
    cascade: true,
  })
  @JoinTable({
    name: 'projetos_funcionarios',
    joinColumn: {
      name: 'projetoId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'funcionarioId',
      referencedColumnName: 'id',
    },
  })
  funcionarios: Employee[];
}
