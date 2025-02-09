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
import { UsersService } from '../users/users.service';

@Injectable()
export class VacationsService {
  constructor(
    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
  ) {}

  async create(employeeId: number, createVacationDto: CreateVacationDto) {
    const employee = await this.employeesService.findOne(employeeId);

    const user = await this.usersService.findOne(createVacationDto.criadoPor);

    const vacation = this.vacationRepository.create({
      ...createVacationDto,
      funcionario: employee,
      criadoPor: user,
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
    const user = await this.usersService.findOne(
      updateVacationDto.atualizadoPor,
    );

    const result = await this.vacationRepository.update(id, {
      ...updateVacationDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Férias não encontrada.');
    }

    return `A férias #${id} foi atualizada.`;
  }

  async remove(id: number, deleteVacationDto: BaseDeleteDto) {
    const user = await this.usersService.findOne(deleteVacationDto.excluidoPor);

    const result = await this.vacationRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Férias não encontrada.');
    }

    return `A férias #${id} foi excluída.`;
  }
}
