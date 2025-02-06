import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../../config/database/entities/base.entity';
import { Employee } from '../../../modules/employees/entities/employee.entity';
import { Epi } from '../../../modules/epis/entities/epi.entity';

@Entity('entregas_de_epis')
export class EpiDelivery extends BaseEntity {
  @Column({ name: 'data', type: 'timestamptz' })
  data: Date;

  @ManyToMany(() => Epi, (epi) => epi.entregasDeEpis, { cascade: true })
  @JoinTable({
    name: 'entregas_epis',
    joinColumn: {
      name: 'entregaId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'epiId',
      referencedColumnName: 'id',
    },
  })
  epis: Epi[];

  @Column({ name: 'motivo', type: 'varchar', length: 255 })
  motivo: string;

  @Column({ name: 'entregue_por', type: 'varchar', length: 255 })
  entreguePor: string;

  @ManyToOne(() => Employee, (employee) => employee.entregasDeEpis)
  funcionario: Employee;
}
