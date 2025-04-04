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
import { AbsenceModule } from './modules/absence/absence.module';
import { MedicalCertificateModule } from './modules/medical-certificate/medical-certificate.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { TerminationsModule } from './modules/terminations/terminations.module';
import { CpfAnalysisModule } from './modules/cpf-analysis/cpf-analysis.module';
import { AccidentsModule } from './modules/accidents/accidents.module';
import { WarningsModule } from './modules/warnings/warnings.module';
import { LaborActionsModule } from './modules/labor-actions/labor-actions.module';
import { EpiDeliveryModule } from './modules/epi-delivery/epi-delivery.module';
import { VacationsModule } from './modules/vacations/vacations.module';
import { EmployeesProjectsModule } from './modules/employees-projects/employees-projects.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { MailModule } from './modules/services/mail/mail.module';

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
    AbsenceModule,
    MedicalCertificateModule,
    PromotionModule,
    TerminationsModule,
    CpfAnalysisModule,
    AccidentsModule,
    WarningsModule,
    LaborActionsModule,
    EpiDeliveryModule,
    VacationsModule,
    EmployeesProjectsModule,
    PaymentsModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
