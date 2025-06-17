import { Module } from '@nestjs/common';
import { WarningsService } from './warnings.service';
import { WarningsController } from './warnings.controller';
import { EmployeeWarningsController } from './employee-warnings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warning } from './entities/warning.entity';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Warning]),
    EmployeesModule,
    UsersModule,
    CompaniesModule,
  ],
  controllers: [WarningsController, EmployeeWarningsController],
  providers: [WarningsService],
})
export class WarningsModule {}
