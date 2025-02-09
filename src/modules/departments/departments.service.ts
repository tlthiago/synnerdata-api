import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CompaniesService } from '../companies/companies.service';
import { UsersService } from '../users/users.service';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
  ) {}

  async create(companyId: number, createDepartmentDto: CreateDepartmentDto) {
    const company = await this.companiesService.findOne(companyId);

    const user = await this.usersService.findOne(createDepartmentDto.criadoPor);

    const department = this.departmentRepository.create({
      ...createDepartmentDto,
      empresa: company,
      criadoPor: user,
    });

    await this.departmentRepository.save(department);

    return department.id;
  }

  async findAll(companyId: number) {
    await this.companiesService.findOne(companyId);

    return this.departmentRepository.find({
      where: {
        empresa: { id: companyId },
        status: 'A',
      },
    });
  }

  findOne(id: number) {
    return this.departmentRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const user = await this.usersService.findOne(
      updateDepartmentDto.atualizadoPor,
    );

    const result = await this.departmentRepository.update(id, {
      ...updateDepartmentDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Setor não encontrado.');
    }

    return `O setor #${id} foi atualizado.`;
  }

  async remove(id: number, deleteDepartmentDto: BaseDeleteDto) {
    const user = await this.usersService.findOne(
      deleteDepartmentDto.excluidoPor,
    );

    const result = await this.departmentRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Setor não encontrado.');
    }

    return `O setor #${id} foi excluído.`;
  }
}
