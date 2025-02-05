import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { Vacation } from './entities/vacation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { VacationResponseDto } from './dto/vacation-response.dto';
import { BaseDeleteDto } from 'src/common/utils/dto/base-delete.dto';

@Injectable()
export class VacationsService {
  constructor(
    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>,
    private readonly employeesService: EmployeesService,
  ) {}

  async create(employeeId: number, createVacationDto: CreateVacationDto) {
    const employee = await this.employeesService.findOne(employeeId);

    const vacation = this.vacationRepository.create({
      ...createVacationDto,
      funcionario: employee,
    });

    await this.vacationRepository.save(vacation);

    return vacation.id;
  }

  async findAll(employeeId: number) {
    await this.employeesService.findOne(employeeId);

    const vacations = await this.vacationRepository.find({
      where: {
        funcionario: { id: employeeId },
        status: 'A',
      },
    });

    return plainToInstance(VacationResponseDto, vacations);
  }

  async findOne(id: number) {
    const vacation = await this.vacationRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    return plainToInstance(VacationResponseDto, vacation);
  }

  async update(id: number, updateVacationDto: UpdateVacationDto) {
    const result = await this.vacationRepository.update(id, {
      ...updateVacationDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Férias não encontrada.');
    }

    return `A férias #${id} foi atualizada.`;
  }

  async remove(id: number, deleteVacationDto: BaseDeleteDto) {
    const result = await this.vacationRepository.update(id, {
      status: 'E',
      atualizadoPor: deleteVacationDto.excluidoPor,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Férias não encontrada.');
    }

    return `A férias #${id} foi excluída.`;
  }
}
