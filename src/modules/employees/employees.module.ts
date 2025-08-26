import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { EmployeeTemplateController } from './employee-template.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { CompaniesModule } from '../companies/companies.module';
import { RolesModule } from '../roles/roles.module';
import { DepartmentsModule } from '../departments/departments.module';
import { CostCentersModule } from '../cost-centers/cost-centers.module';
import { CbosModule } from '../cbos/cbos.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    CompaniesModule,
    RolesModule,
    DepartmentsModule,
    CostCentersModule,
    CbosModule,
    UsersModule,
  ],
  controllers: [EmployeesController, EmployeeTemplateController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
