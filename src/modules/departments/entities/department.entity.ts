import { Entity, Column, ManyToOne } from 'typeorm';
import { Company } from '../../../modules/companies/entities/company.entity';
import { BaseEntity } from '../../../config/database/entities/base.entity';

@Entity('setores')
export class Department extends BaseEntity {
  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @ManyToOne(() => Company, (company) => company.setores)
  empresa: Company;
}
