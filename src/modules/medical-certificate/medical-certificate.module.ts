import { Module } from '@nestjs/common';
import { MedicalCertificateService } from './medical-certificate.service';
import { MedicalCertificateController } from './medical-certificate.controller';
import { MedicalCertificate } from './entities/medical-certificate.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalCertificate]), EmployeesModule],
  controllers: [MedicalCertificateController],
  providers: [MedicalCertificateService],
})
export class MedicalCertificateModule {}
