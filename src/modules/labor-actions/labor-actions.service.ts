import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLaborActionDto } from './dto/create-labor-action.dto';
import { UpdateLaborActionDto } from './dto/update-labor-action.dto';
import { LaborAction } from './entities/labor-action.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { LaborActionResponseDto } from './dto/labor-action-response.dto';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class LaborActionsService {
  constructor(
    @InjectRepository(LaborAction)
    private readonly laborActionRepository: Repository<LaborAction>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(
    employeeId: string,
    createLaborActionDto: CreateLaborActionDto,
    createdBy: string,
  ) {
    const employee = await this.employeesService.findOne(employeeId);

    const user = await this.usersService.findOne(createdBy);

    const laborAction = this.laborActionRepository.create({
      ...createLaborActionDto,
      funcionario: { id: employee.id },
      criadoPor: user,
    });

    await this.laborActionRepository.save(laborAction);

    return await this.findOne(laborAction.id);
  }

  async findAllByCompany(companyId: string) {
    const company = await this.companiesService.findById(companyId);

    const absences = await this.laborActionRepository
      .createQueryBuilder('acoes_trabalhistas')
      .innerJoinAndSelect('acoes_trabalhistas.funcionario', 'funcionario')
      .innerJoinAndSelect('acoes_trabalhistas.criadoPor', 'criadoPor')
      .leftJoinAndSelect('acoes_trabalhistas.atualizadoPor', 'atualizadoPor')
      .innerJoin('funcionario.empresa', 'empresa')
      .where('empresa.id = :companyId', { companyId: company.id })
      .andWhere('acoes_trabalhistas.status = :status', { status: 'A' })
      .getMany();

    return plainToInstance(LaborActionResponseDto, absences, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(employeeId: string) {
    const employee = await this.employeesService.findOne(employeeId);

    const laborActions = await this.laborActionRepository.find({
      where: {
        funcionario: { id: employee.id },
        status: 'A',
      },
      relations: ['funcionario'],
    });

    return plainToInstance(LaborActionResponseDto, laborActions, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const laborAction = await this.laborActionRepository.findOne({
      where: {
        id,
        status: 'A',
      },
      relations: ['funcionario'],
    });

    if (!laborAction) {
      throw new NotFoundException('Ação trabalhista não encontrada.');
    }

    return plainToInstance(LaborActionResponseDto, laborAction, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateLaborActionDto: UpdateLaborActionDto,
    updatedBy: string,
  ) {
    const user = await this.usersService.findOne(updatedBy);

    const result = await this.laborActionRepository.update(id, {
      ...updateLaborActionDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Ação trabalhista não encontrada.');
    }

    return await this.findOne(id);
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.laborActionRepository.update(
      { id, status: 'A' },
      {
        status: 'E',
        atualizadoPor: user,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException(
        'Ação trabalhista já excluída ou não encontrada.',
      );
    }

    const removedLaborAction = await this.laborActionRepository.findOne({
      where: { id },
      relations: ['funcionario'],
    });

    return plainToInstance(LaborActionResponseDto, removedLaborAction, {
      excludeExtraneousValues: true,
    });
  }
}
