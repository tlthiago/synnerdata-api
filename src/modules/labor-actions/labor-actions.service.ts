import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLaborActionDto } from './dto/create-labor-action.dto';
import { UpdateLaborActionDto } from './dto/update-labor-action.dto';
import { LaborAction } from './entities/labor-action.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { LaborActionResponseDto } from './dto/labor-action-response.dto';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class LaborActionsService {
  constructor(
    @InjectRepository(LaborAction)
    private readonly laborActionRepository: Repository<LaborAction>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
  ) {}

  async create(employeeId: number, createLaborActionDto: CreateLaborActionDto) {
    const employee = await this.employeesService.findOne(employeeId);

    const user = await this.usersService.findOne(
      createLaborActionDto.criadoPor,
    );

    const laborAction = this.laborActionRepository.create({
      ...createLaborActionDto,
      funcionario: employee,
      criadoPor: user,
    });

    await this.laborActionRepository.save(laborAction);

    return laborAction.id;
  }

  async findAll(employeeId: number) {
    const employee = await this.employeesService.findOne(employeeId);

    const laborActions = await this.laborActionRepository.find({
      where: {
        funcionario: { id: employee.id },
        status: 'A',
      },
    });

    return plainToInstance(LaborActionResponseDto, laborActions, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number) {
    const laborAction = await this.laborActionRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!laborAction) {
      throw new NotFoundException('Ação trabalhista não encontrada.');
    }

    return plainToInstance(LaborActionResponseDto, laborAction, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, updateLaborActionDto: UpdateLaborActionDto) {
    const user = await this.usersService.findOne(
      updateLaborActionDto.atualizadoPor,
    );

    const result = await this.laborActionRepository.update(id, {
      ...updateLaborActionDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Ação trabalhista não encontrada.');
    }

    return this.findOne(id);
  }

  async remove(id: number, deleteLaborActionDto: BaseDeleteDto) {
    const user = await this.usersService.findOne(
      deleteLaborActionDto.excluidoPor,
    );

    const result = await this.laborActionRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Ação trabalhista não encontrada.');
    }

    return { id, status: 'E' };
  }
}
