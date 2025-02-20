import { Entity, Column, ManyToOne } from 'typeorm';
import { Company } from '../../../modules/companies/entities/company.entity';
import { BaseEntity } from '../../../config/database/entities/base.entity';

@Entity('centros_de_custo')
export class CostCenter extends BaseEntity {
  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @ManyToOne(() => Company, (company) => company.centrosDeCusto)
  empresa: Company;
}
