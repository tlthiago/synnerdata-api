import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { EmployeesModule } from '../employees/employees.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Promotion]),
    EmployeesModule,
    RolesModule,
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
})
export class PromotionModule {}
