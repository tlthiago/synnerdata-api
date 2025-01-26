import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../config/database/entities/base.entity';
import { Company } from '../../../modules/companies/entities/company.entity';

@Entity('epis')
export class Epi extends BaseEntity {
  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @Column({ name: 'descricao', type: 'varchar', length: 255 })
  descricao: string;

  @Column({ name: 'equipamentos', type: 'varchar', length: 255 })
  equipamentos: string;

  @ManyToOne(() => Company, (company) => company.epis)
  empresa: Company;
}
