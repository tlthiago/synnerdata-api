import { Module } from '@nestjs/common';
import { CbosService } from './cbos.service';
import { CbosController } from './cbos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cbo } from './entities/cbo.entity';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cbo]), CompaniesModule],
  controllers: [CbosController],
  providers: [CbosService],
})
export class CbosModule {}
