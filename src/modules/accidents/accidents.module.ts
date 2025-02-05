import { Module } from '@nestjs/common';
import { AccidentsService } from './accidents.service';
import { AccidentsController } from './accidents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accident } from './entities/accident.entity';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [TypeOrmModule.forFeature([Accident]), EmployeesModule],
  controllers: [AccidentsController],
  providers: [AccidentsService],
})
export class AccidentsModule {}
