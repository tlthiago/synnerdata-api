import { Module } from '@nestjs/common';
import { EmployeesProjectsService } from './employees-projects.service';
import { EmployeesProjectsController } from './employees-projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeProjectLogs } from './entities/project-employee-logs.entity';
import { Project } from '../projects/entities/project.entity';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeProjectLogs, Project]),
    EmployeesModule,
  ],
  controllers: [EmployeesProjectsController],
  providers: [EmployeesProjectsService],
})
export class EmployeesProjectsModule {}
