import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarningDto } from './dto/create-warning.dto';
import { UpdateWarningDto } from './dto/update-warning.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Warning } from './entities/warning.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { WarningResponseDto } from './dto/warning-response.dto';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class WarningsService {
  constructor(
    @InjectRepository(Warning)
    private readonly warningRepository: Repository<Warning>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
  ) {}

  async create(employeeId: number, createWarningDto: CreateWarningDto) {
    const employee = await this.employeesService.findOne(employeeId);

    const user = await this.usersService.findOne(createWarningDto.criadoPor);

    const warning = this.warningRepository.create({
      ...createWarningDto,
      funcionario: employee,
      criadoPor: user,
    });

    await this.warningRepository.save(warning);

    return warning.id;
  }

  async findAll(employeeId: number) {
    const employee = await this.employeesService.findOne(employeeId);

    const warnings = await this.warningRepository.find({
      where: {
        funcionario: { id: employee.id },
        status: 'A',
      },
    });

    return plainToInstance(WarningResponseDto, warnings, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number) {
    const warning = await this.warningRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!warning) {
      throw new NotFoundException('Advertência não encontrada.');
    }

    return plainToInstance(WarningResponseDto, warning, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, updateWarningDto: UpdateWarningDto) {
    const user = await this.usersService.findOne(
      updateWarningDto.atualizadoPor,
    );

    const result = await this.warningRepository.update(id, {
      ...updateWarningDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Advertência não encontrada.');
    }

    return this.findOne(id);
  }

  async remove(id: number, deleteWarningDto: BaseDeleteDto) {
    const user = await this.usersService.findOne(deleteWarningDto.excluidoPor);

    const result = await this.warningRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Advertência não encontrada.');
    }

    return { id, status: 'E' };
  }
}
