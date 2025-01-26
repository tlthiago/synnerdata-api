import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../config/database/entities/base.entity';
import { Company } from '../../../modules/companies/entities/company.entity';

@Entity('cbos')
export class Cbo extends BaseEntity {
  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @ManyToOne(() => Company, (company) => company.cbos)
  empresa: Company;
}
