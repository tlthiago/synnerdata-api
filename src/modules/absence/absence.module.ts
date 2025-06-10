import { Module } from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { AbsenceController } from './absence.controller';
import { EmployeeAbsenceController } from './employee-absence.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Absence } from './entities/absence.entity';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Absence]),
    EmployeesModule,
    UsersModule,
    CompaniesModule,
  ],
  controllers: [AbsenceController, EmployeeAbsenceController],
  providers: [AbsenceService],
})
export class AbsenceModule {}
