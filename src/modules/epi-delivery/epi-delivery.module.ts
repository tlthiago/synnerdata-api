import { Module } from '@nestjs/common';
import { EpiDeliveryService } from './epi-delivery.service';
import { EpiDeliveryController } from './epi-delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpiDelivery } from './entities/epi-delivery.entity';
import { EmployeesModule } from '../employees/employees.module';
import { EpiDeliveryLogs } from './entities/delivery-epi-logs.entity';
import { EpisModule } from '../epis/epis.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EpiDelivery, EpiDeliveryLogs]),
    EmployeesModule,
    EpisModule,
    UsersModule,
  ],
  controllers: [EpiDeliveryController],
  providers: [EpiDeliveryService],
})
export class EpiDeliveryModule {}
