import { Module } from '@nestjs/common';
import { TerminationsService } from './terminations.service';
import { TerminationsController } from './terminations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Termination } from './entities/termination.entity';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Termination]),
    EmployeesModule,
    UsersModule,
  ],
  controllers: [TerminationsController],
  providers: [TerminationsService],
})
export class TerminationsModule {}
