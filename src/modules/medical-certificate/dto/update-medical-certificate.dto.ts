import { PartialType } from '@nestjs/swagger';
import { CreateMedicalCertificateDto } from './create-medical-certificate.dto';

export class UpdateMedicalCertificateDto extends PartialType(
  CreateMedicalCertificateDto,
) {}
