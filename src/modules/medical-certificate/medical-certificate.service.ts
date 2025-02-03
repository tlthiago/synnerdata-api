import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicalCertificateDto } from './dto/create-medical-certificate.dto';
import { UpdateMedicalCertificateDto } from './dto/update-medical-certificate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicalCertificate } from './entities/medical-certificate.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { MedicalCertificateResponseDto } from './dto/medical-certificate-response.dto';
import { BaseDeleteDto } from 'src/common/utils/dto/base-delete.dto';

@Injectable()
export class MedicalCertificateService {
  constructor(
    @InjectRepository(MedicalCertificate)
    private readonly medicalCertificateRepository: Repository<MedicalCertificate>,
    private readonly employeesService: EmployeesService,
  ) {}

  async create(
    employeeId: number,
    createMedicalCertificateDto: CreateMedicalCertificateDto,
  ) {
    const employee = await this.employeesService.findOne(employeeId);

    const medicalcertificate = this.medicalCertificateRepository.create({
      ...createMedicalCertificateDto,
      funcionario: employee,
    });

    await this.medicalCertificateRepository.save(medicalcertificate);

    return medicalcertificate.id;
  }

  async findAll(employeeId: number) {
    await this.employeesService.findOne(employeeId);

    const medicalcertificates = await this.medicalCertificateRepository.find({
      where: {
        funcionario: { id: employeeId },
        status: 'A',
      },
    });

    return plainToInstance(MedicalCertificateResponseDto, medicalcertificates);
  }

  async findOne(id: number) {
    const medicalcertificate = await this.medicalCertificateRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    return plainToInstance(MedicalCertificateResponseDto, medicalcertificate);
  }

  async update(
    id: number,
    updateMedicalCertificateDto: UpdateMedicalCertificateDto,
  ) {
    const result = await this.medicalCertificateRepository.update(id, {
      ...updateMedicalCertificateDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Atestado não encontrado.');
    }

    return `O atestado #${id} foi atualizado.`;
  }

  async remove(id: number, deleteMedicalCertificateDto: BaseDeleteDto) {
    const result = await this.medicalCertificateRepository.update(id, {
      status: 'E',
      atualizadoPor: deleteMedicalCertificateDto.excluidoPor,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Atestado não encontrado.');
    }

    return `O atestado #${id} foi excluído.`;
  }
}
