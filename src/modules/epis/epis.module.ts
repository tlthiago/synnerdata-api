import { Module } from '@nestjs/common';
import { EpisService } from './epis.service';
import { EpisController } from './epis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Epi } from './entities/epi.entity';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [TypeOrmModule.forFeature([Epi]), CompaniesModule],
  controllers: [EpisController],
  providers: [EpisService],
  exports: [EpisService],
})
export class EpisModule {}
