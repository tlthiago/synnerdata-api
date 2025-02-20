import { Module } from '@nestjs/common';
import { LaborActionsService } from './labor-actions.service';
import { LaborActionsController } from './labor-actions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaborAction } from './entities/labor-action.entity';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LaborAction]),
    EmployeesModule,
    UsersModule,
  ],
  controllers: [LaborActionsController],
  providers: [LaborActionsService],
})
export class LaborActionsModule {}
