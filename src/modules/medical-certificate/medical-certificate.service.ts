import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMedicalCertificateDto } from './dto/create-medical-certificate.dto';
import { UpdateMedicalCertificateDto } from './dto/update-medical-certificate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicalCertificate } from './entities/medical-certificate.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { MedicalCertificateResponseDto } from './dto/medical-certificate-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class MedicalCertificateService {
  constructor(
    @InjectRepository(MedicalCertificate)
    private readonly medicalCertificateRepository: Repository<MedicalCertificate>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    employeeId: string,
    createMedicalCertificateDto: CreateMedicalCertificateDto,
    createdBy: string,
  ) {
    const employee = await this.employeesService.findOne(employeeId);

    const { dataInicio, dataFim, ...rest } = createMedicalCertificateDto;

    const dataInicioDate = new Date(dataInicio);
    const dataFimDate = new Date(dataFim);

    if (dataFimDate <= dataInicioDate) {
      throw new BadRequestException(
        'A data fim deve ser posterior à data início.',
      );
    }

    const user = await this.usersService.findOne(createdBy);

    const medicalCertificate = this.medicalCertificateRepository.create({
      ...rest,
      dataInicio: dataInicioDate,
      dataFim: dataFimDate,
      funcionario: { id: employee.id },
      criadoPor: user,
    });

    await this.medicalCertificateRepository.save(medicalCertificate);

    return plainToInstance(MedicalCertificateResponseDto, medicalCertificate, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(employeeId: string) {
    const employee = await this.employeesService.findOne(employeeId);

    const medicalCertificates = await this.medicalCertificateRepository.find({
      where: {
        funcionario: { id: employee.id },
        status: 'A',
      },
    });

    return plainToInstance(MedicalCertificateResponseDto, medicalCertificates, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const medicalCertificate = await this.medicalCertificateRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!medicalCertificate) {
      throw new NotFoundException('Atestado não encontrado.');
    }

    return plainToInstance(MedicalCertificateResponseDto, medicalCertificate, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateMedicalCertificateDto: UpdateMedicalCertificateDto,
    updatedBy: string,
  ) {
    const { dataInicio, dataFim, ...rest } = updateMedicalCertificateDto;

    const dataInicioDate = new Date(dataInicio);
    const dataFimDate = new Date(dataFim);

    if (dataFimDate <= dataInicioDate) {
      throw new BadRequestException(
        'A data fim deve ser posterior à data início.',
      );
    }

    const user = await this.usersService.findOne(updatedBy);

    const result = await this.medicalCertificateRepository.update(id, {
      ...rest,
      dataInicio: dataInicioDate,
      dataFim: dataFimDate,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Atestado não encontrado.');
    }

    const updatedMedicalCertificate = await this.findOne(id);

    return updatedMedicalCertificate;
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.medicalCertificateRepository.update(
      { id, status: 'A' },
      {
        status: 'E',
        atualizadoPor: user,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Atestado já excluído ou não encontrado.');
    }

    const removedMedicalCertificate =
      await this.medicalCertificateRepository.findOne({
        where: { id },
      });

    return plainToInstance(
      MedicalCertificateResponseDto,
      removedMedicalCertificate,
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
