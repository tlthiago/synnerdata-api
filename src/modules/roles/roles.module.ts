import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { CompaniesModule } from '../companies/companies.module';
import { EpisModule } from '../epis/epis.module';
import { RoleEpiLogs } from './entities/role-epi-logs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RoleEpiLogs]),
    CompaniesModule,
    EpisModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
