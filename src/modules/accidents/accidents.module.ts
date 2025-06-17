import { Module } from '@nestjs/common';
import { AccidentsService } from './accidents.service';
import { AccidentsController } from './accidents.controller';
import { EmployeeAccidentsController } from './employee-accidents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accident } from './entities/accident.entity';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accident]),
    EmployeesModule,
    UsersModule,
    CompaniesModule,
  ],
  controllers: [AccidentsController, EmployeeAccidentsController],
  providers: [AccidentsService],
})
export class AccidentsModule {}
