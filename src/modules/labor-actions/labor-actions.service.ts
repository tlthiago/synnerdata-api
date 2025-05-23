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

@Injectable()
export class LaborActionsService {
  constructor(
    @InjectRepository(LaborAction)
    private readonly laborActionRepository: Repository<LaborAction>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
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

    return plainToInstance(LaborActionResponseDto, laborAction, {
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

    const updatedLaborAction = await this.findOne(id);

    return updatedLaborAction;
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
    });

    return plainToInstance(LaborActionResponseDto, removedLaborAction, {
      excludeExtraneousValues: true,
    });
  }
}
