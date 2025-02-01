import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './config/database/database.module';
import { StatusModule } from './modules/status/status.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { BranchesModule } from './modules/branches/branches.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { CostCentersModule } from './modules/cost-centers/cost-centers.module';
import { CbosModule } from './modules/cbos/cbos.module';
import { RolesModule } from './modules/roles/roles.module';
import { EpisModule } from './modules/epis/epis.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development.local',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    DatabaseModule,
    StatusModule,
    UsersModule,
    AuthModule,
    CompaniesModule,
    BranchesModule,
    DepartmentsModule,
    CostCentersModule,
    CbosModule,
    RolesModule,
    EpisModule,
    EmployeesModule,
    ProjectsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
