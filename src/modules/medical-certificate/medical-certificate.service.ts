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
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class MedicalCertificateService {
  constructor(
    @InjectRepository(MedicalCertificate)
    private readonly medicalCertificateRepository: Repository<MedicalCertificate>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
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

    if (dataFimDate < dataInicioDate) {
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

    return await this.findOne(medicalCertificate.id);
  }

  async findAllByCompany(companyId: string) {
    const company = await this.companiesService.findById(companyId);

    const absences = await this.medicalCertificateRepository
      .createQueryBuilder('atestado')
      .innerJoinAndSelect('atestado.funcionario', 'funcionario')
      .innerJoinAndSelect('atestado.criadoPor', 'criadoPor')
      .leftJoinAndSelect('atestado.atualizadoPor', 'atualizadoPor')
      .innerJoin('funcionario.empresa', 'empresa')
      .where('empresa.id = :companyId', { companyId: company.id })
      .andWhere('atestado.status = :status', { status: 'A' })
      .getMany();

    return plainToInstance(MedicalCertificateResponseDto, absences, {
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
      relations: ['funcionario'],
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
      relations: ['funcionario'],
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

    if (dataFimDate < dataInicioDate) {
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

    return await this.findOne(id);
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
        relations: ['funcionario'],
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
