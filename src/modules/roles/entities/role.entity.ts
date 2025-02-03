import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../config/database/entities/base.entity';
import { Company } from '../../../modules/companies/entities/company.entity';
import { Epi } from '../../../modules/epis/entities/epi.entity';
import { Promotion } from '../../../modules/promotion/entities/promotion.entity';

@Entity('funcoes')
export class Role extends BaseEntity {
  @Column()
  nome: string;

  @ManyToOne(() => Company, (company) => company.funcoes)
  empresa: Company;

  @ManyToMany(() => Epi, (epi) => epi.funcoes, { cascade: true })
  @JoinTable({
    name: 'funcoes_epis',
    joinColumn: {
      name: 'funcaoId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'epiId',
      referencedColumnName: 'id',
    },
  })
  epis: Epi[];

  @OneToMany(() => Promotion, (promotion) => promotion.funcao)
  promocoes: Promotion[];
}
