import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarningDto } from './dto/create-warning.dto';
import { UpdateWarningDto } from './dto/update-warning.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Warning } from './entities/warning.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { WarningResponseDto } from './dto/warning-response.dto';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class WarningsService {
  constructor(
    @InjectRepository(Warning)
    private readonly warningRepository: Repository<Warning>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(
    employeeId: string,
    createWarningDto: CreateWarningDto,
    createdBy: string,
  ) {
    const employee = await this.employeesService.findOne(employeeId);

    const user = await this.usersService.findOne(createdBy);

    const warning = this.warningRepository.create({
      ...createWarningDto,
      funcionario: { id: employee.id },
      criadoPor: user,
    });

    await this.warningRepository.save(warning);

    return await this.findOne(warning.id);
  }

  async findAllByCompany(companyId: string) {
    const company = await this.companiesService.findById(companyId);

    const absences = await this.warningRepository
      .createQueryBuilder('advertencia')
      .innerJoinAndSelect('advertencia.funcionario', 'funcionario')
      .innerJoinAndSelect('advertencia.criadoPor', 'criadoPor')
      .leftJoinAndSelect('advertencia.atualizadoPor', 'atualizadoPor')
      .innerJoin('funcionario.empresa', 'empresa')
      .where('empresa.id = :companyId', { companyId: company.id })
      .andWhere('advertencia.status = :status', { status: 'A' })
      .getMany();

    return plainToInstance(WarningResponseDto, absences, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(employeeId: string) {
    const employee = await this.employeesService.findOne(employeeId);

    const warnings = await this.warningRepository.find({
      where: {
        funcionario: { id: employee.id },
        status: 'A',
      },
      relations: ['funcionario'],
    });

    return plainToInstance(WarningResponseDto, warnings, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const warning = await this.warningRepository.findOne({
      where: {
        id,
        status: 'A',
      },
      relations: ['funcionario'],
    });

    if (!warning) {
      throw new NotFoundException('Advertência não encontrada.');
    }

    return plainToInstance(WarningResponseDto, warning, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateWarningDto: UpdateWarningDto,
    updatedBy: string,
  ) {
    const user = await this.usersService.findOne(updatedBy);

    const result = await this.warningRepository.update(id, {
      ...updateWarningDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Advertência não encontrada.');
    }

    return await this.findOne(id);
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.warningRepository.update(
      { id, status: 'A' },
      {
        status: 'E',
        atualizadoPor: user,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Advertência já excluída ou não encontrada.');
    }

    const removedWarning = await this.warningRepository.findOne({
      where: { id },
      relations: ['funcionario'],
    });

    return plainToInstance(WarningResponseDto, removedWarning, {
      excludeExtraneousValues: true,
    });
  }
}
