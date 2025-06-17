import { Module } from '@nestjs/common';
import { EpiDeliveryService } from './epi-delivery.service';
import { EpiDeliveryController } from './epi-delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpiDelivery } from './entities/epi-delivery.entity';
import { EmployeesModule } from '../employees/employees.module';
import { EpiDeliveryLogs } from './entities/delivery-epi-logs.entity';
import { EpisModule } from '../epis/epis.module';
import { UsersModule } from '../users/users.module';
import { EmployeeEpiDeliveryController } from './employee-epi-delivery.controller';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EpiDelivery, EpiDeliveryLogs]),
    EmployeesModule,
    EpisModule,
    UsersModule,
    CompaniesModule,
  ],
  controllers: [EpiDeliveryController, EmployeeEpiDeliveryController],
  providers: [EpiDeliveryService],
})
export class EpiDeliveryModule {}
