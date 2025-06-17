import { Module } from '@nestjs/common';
import { VacationsService } from './vacations.service';
import { VacationsController } from './vacations.controller';
import { EmployeeVacationsController } from './employee-vacations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacation } from './entities/vacation.entity';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vacation]),
    EmployeesModule,
    UsersModule,
    CompaniesModule,
  ],
  controllers: [VacationsController, EmployeeVacationsController],
  providers: [VacationsService],
})
export class VacationsModule {}
