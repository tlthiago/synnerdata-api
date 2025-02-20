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
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';
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
    employeeId: number,
    createMedicalCertificateDto: CreateMedicalCertificateDto,
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

    const user = await this.usersService.findOne(
      createMedicalCertificateDto.criadoPor,
    );

    const medicalCertificate = this.medicalCertificateRepository.create({
      ...rest,
      dataInicio: dataInicioDate,
      dataFim: dataFimDate,
      funcionario: employee,
      criadoPor: user,
    });

    await this.medicalCertificateRepository.save(medicalCertificate);

    return medicalCertificate.id;
  }

  async findAll(employeeId: number) {
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

  async findOne(id: number) {
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
    id: number,
    updateMedicalCertificateDto: UpdateMedicalCertificateDto,
  ) {
    const { dataInicio, dataFim, ...rest } = updateMedicalCertificateDto;

    const dataInicioDate = new Date(dataInicio);
    const dataFimDate = new Date(dataFim);

    if (dataFimDate <= dataInicioDate) {
      throw new BadRequestException(
        'A data fim deve ser posterior à data início.',
      );
    }

    const user = await this.usersService.findOne(
      updateMedicalCertificateDto.atualizadoPor,
    );

    const result = await this.medicalCertificateRepository.update(id, {
      ...rest,
      dataInicio: dataInicioDate,
      dataFim: dataFimDate,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Atestado não encontrado.');
    }

    return this.findOne(id);
  }

  async remove(id: number, deleteMedicalCertificateDto: BaseDeleteDto) {
    const user = await this.usersService.findOne(
      deleteMedicalCertificateDto.excluidoPor,
    );

    const result = await this.medicalCertificateRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Atestado não encontrado.');
    }

    return { id, status: 'E' };
  }
}
