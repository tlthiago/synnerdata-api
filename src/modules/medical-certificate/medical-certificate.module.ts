import { Module } from '@nestjs/common';
import { MedicalCertificateService } from './medical-certificate.service';
import { MedicalCertificateController } from './medical-certificate.controller';
import { EmployeeMedicalCertificateController } from './employee-medical-certificate.controller';
import { MedicalCertificate } from './entities/medical-certificate.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicalCertificate]),
    EmployeesModule,
    UsersModule,
    CompaniesModule,
  ],
  controllers: [
    MedicalCertificateController,
    EmployeeMedicalCertificateController,
  ],
  providers: [MedicalCertificateService],
})
export class MedicalCertificateModule {}
