import { Module } from '@nestjs/common';
import { LaborActionsService } from './labor-actions.service';
import { LaborActionsController } from './labor-actions.controller';
import { EmployeeLaborActionsController } from './employee-labor-actions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaborAction } from './entities/labor-action.entity';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LaborAction]),
    EmployeesModule,
    UsersModule,
    CompaniesModule,
  ],
  controllers: [LaborActionsController, EmployeeLaborActionsController],
  providers: [LaborActionsService],
})
export class LaborActionsModule {}
