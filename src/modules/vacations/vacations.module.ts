import { Module } from '@nestjs/common';
import { VacationsService } from './vacations.service';
import { VacationsController } from './vacations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacation } from './entities/vacation.entity';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vacation]), EmployeesModule, UsersModule],
  controllers: [VacationsController],
  providers: [VacationsService],
})
export class VacationsModule {}
