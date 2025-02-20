import { Module } from '@nestjs/common';
import { CpfAnalysisService } from './cpf-analysis.service';
import { CpfAnalysisController } from './cpf-analysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CpfAnalysis } from './entities/cpf-analysis.entity';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CpfAnalysis]),
    EmployeesModule,
    UsersModule,
  ],
  controllers: [CpfAnalysisController],
  providers: [CpfAnalysisService],
})
export class CpfAnalysisModule {}
