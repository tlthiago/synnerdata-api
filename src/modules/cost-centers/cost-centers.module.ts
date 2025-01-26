import { Module } from '@nestjs/common';
import { CostCentersService } from './cost-centers.service';
import { CostCentersController } from './cost-centers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CostCenter } from './entities/cost-center.entity';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [TypeOrmModule.forFeature([CostCenter]), CompaniesModule],
  controllers: [CostCentersController],
  providers: [CostCentersService],
})
export class CostCentersModule {}
