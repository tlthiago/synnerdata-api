import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarningDto } from './dto/create-warning.dto';
import { UpdateWarningDto } from './dto/update-warning.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Warning } from './entities/warning.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { WarningResponseDto } from './dto/warning-response.dto';
import { BaseDeleteDto } from 'src/common/utils/dto/base-delete.dto';

@Injectable()
export class WarningsService {
  constructor(
    @InjectRepository(Warning)
    private readonly warningRepository: Repository<Warning>,
    private readonly employeesService: EmployeesService,
  ) {}

  async create(employeeId: number, createWarningDto: CreateWarningDto) {
    const employee = await this.employeesService.findOne(employeeId);

    const warning = this.warningRepository.create({
      ...createWarningDto,
      funcionario: employee,
    });

    await this.warningRepository.save(warning);

    return warning.id;
  }

  async findAll(employeeId: number) {
    await this.employeesService.findOne(employeeId);

    const warnings = await this.warningRepository.find({
      where: {
        funcionario: { id: employeeId },
        status: 'A',
      },
    });

    return plainToInstance(WarningResponseDto, warnings);
  }

  async findOne(id: number) {
    const warning = await this.warningRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    return plainToInstance(WarningResponseDto, warning);
  }

  async update(id: number, updateWarningDto: UpdateWarningDto) {
    const result = await this.warningRepository.update(id, {
      ...updateWarningDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Advertência não encontrada.');
    }

    return `A advertência #${id} foi atualizada.`;
  }

  async remove(id: number, deleteWarningDto: BaseDeleteDto) {
    const result = await this.warningRepository.update(id, {
      status: 'E',
      atualizadoPor: deleteWarningDto.excluidoPor,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Advertência não encontrada.');
    }

    return `A advertência #${id} foi excluída.`;
  }
}
