import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { EmployeesModule } from '../employees/employees.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { EmployeePromotionController } from './employee-promotion.controller';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Promotion]),
    EmployeesModule,
    RolesModule,
    UsersModule,
    CompaniesModule,
  ],
  controllers: [PromotionController, EmployeePromotionController],
  providers: [PromotionService],
})
export class PromotionModule {}
