import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Employee } from '../../employees/entities/employee.entity';

export enum EmployeeProjectAction {
  ADICIONOU = 'ADICIONOU',
  REMOVEU = 'REMOVEU',
}

@Entity('funcionarios_projetos_logs')
export class EmployeeProjectLogs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project)
  projeto: Project;

  @ManyToOne(() => Employee)
  funcionario: Employee;

  @CreateDateColumn({
    name: 'data_inicio',
    type: 'date',
  })
  dataInicio: Date;

  @Column({ type: 'enum', enum: EmployeeProjectAction })
  acao: EmployeeProjectAction;

  @Column({ name: 'descricao', type: 'varchar' })
  descricao: string;

  @Column({ name: 'criado_por', type: 'uuid' })
  criadoPor: string;

  @CreateDateColumn({
    name: 'criado_em',
    type: 'timestamptz',
  })
  readonly criadoEm: Date;
}
