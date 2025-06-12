import { Module } from '@nestjs/common';
import { TerminationsService } from './terminations.service';
import { TerminationsController } from './terminations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Termination } from './entities/termination.entity';
import { EmployeesModule } from '../employees/employees.module';
import { EmployeeTerminationsController } from './employee-terminations.controller';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Termination]),
    EmployeesModule,
    UsersModule,
    CompaniesModule,
  ],
  controllers: [TerminationsController, EmployeeTerminationsController],
  providers: [TerminationsService],
})
export class TerminationsModule {}
