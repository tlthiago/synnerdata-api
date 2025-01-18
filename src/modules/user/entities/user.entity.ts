import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IsEmail } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  role: string;

  @Column({ type: 'integer', nullable: true })
  createdBy?: number;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt!: Date;

  @Column({ type: 'integer', nullable: true })
  updatedBy?: number;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt?: Date;
}
