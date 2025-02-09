import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLaborActionDto } from './dto/create-labor-action.dto';
import { UpdateLaborActionDto } from './dto/update-labor-action.dto';
import { LaborAction } from './entities/labor-action.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { LaborActionResponseDto } from './dto/labor-action-response.dto';
import { BaseDeleteDto } from 'src/common/utils/dto/base-delete.dto';
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
    await this.employeesService.findOne(employeeId);

    const laboractions = await this.laborActionRepository.find({
      where: {
        funcionario: { id: employeeId },
        status: 'A',
      },
    });

    return plainToInstance(LaborActionResponseDto, laboractions);
  }

  async findOne(id: number) {
    const laboraction = await this.laborActionRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    return plainToInstance(LaborActionResponseDto, laboraction);
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

    return `A ação trabalhista #${id} foi atualizada.`;
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

    return `A ação trabalhista #${id} foi excluída.`;
  }
}
