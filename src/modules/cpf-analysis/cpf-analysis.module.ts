import { Module } from '@nestjs/common';
import { CpfAnalysisService } from './cpf-analysis.service';
import { CpfAnalysisController } from './cpf-analysis.controller';
import { EmployeeCpfAnalysisController } from './employee-cpf-analysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CpfAnalysis } from './entities/cpf-analysis.entity';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CpfAnalysis]),
    EmployeesModule,
    UsersModule,
    CompaniesModule,
  ],
  controllers: [CpfAnalysisController, EmployeeCpfAnalysisController],
  providers: [CpfAnalysisService],
})
export class CpfAnalysisModule {}
