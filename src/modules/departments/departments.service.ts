import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CompaniesService } from '../companies/companies.service';
import { UsersService } from '../users/users.service';
import { plainToInstance } from 'class-transformer';
import { DepartmentResponseDto } from './dto/department-response.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    companyId: string,
    createDepartmentDto: CreateDepartmentDto,
    createdBy: string,
  ) {
    const company = await this.companiesService.findOne(companyId);

    const user = await this.usersService.findOne(createdBy);

    const department = this.departmentRepository.create({
      ...createDepartmentDto,
      empresa: { id: company.id },
      criadoPor: user,
    });

    await this.departmentRepository.save(department);

    return plainToInstance(DepartmentResponseDto, department, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(companyId: string) {
    const company = await this.companiesService.findOne(companyId);

    const departments = this.departmentRepository.find({
      where: {
        empresa: { id: company.id },
        status: 'A',
      },
    });

    return plainToInstance(DepartmentResponseDto, departments, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const department = await this.departmentRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!department) {
      throw new NotFoundException('Setor não encontrado.');
    }

    return plainToInstance(DepartmentResponseDto, department, {
      excludeExtraneousValues: true,
    });
  }

  async findOneInternal(id: string) {
    const department = await this.departmentRepository.findOne({
      where: {
        id,
      },
    });

    if (!department) {
      throw new NotFoundException('Setor não encontrado.');
    }

    return department;
  }

  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
    updatedBy: string,
  ) {
    const user = await this.usersService.findOne(updatedBy);

    const result = await this.departmentRepository.update(id, {
      ...updateDepartmentDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Setor não encontrado.');
    }

    const updatedDepartment = await this.findOne(id);

    return updatedDepartment;
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.departmentRepository.update(
      { id, status: 'A' },
      {
        status: 'E',
        atualizadoPor: user,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Setor já excluído ou não encontrado.');
    }

    const removedDepartment = await this.departmentRepository.findOne({
      where: { id },
    });

    return plainToInstance(DepartmentResponseDto, removedDepartment, {
      excludeExtraneousValues: true,
    });
  }
}
