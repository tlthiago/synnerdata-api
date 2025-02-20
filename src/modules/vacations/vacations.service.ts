import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { Vacation } from './entities/vacation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { VacationResponseDto } from './dto/vacation-response.dto';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';
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

    const { dataInicio, dataFim } = createVacationDto;

    const dataInicioDate = new Date(dataInicio);
    const dataFimDate = new Date(dataFim);

    if (dataFimDate <= dataInicioDate) {
      throw new BadRequestException(
        'A data fim deve ser posterior à data início.',
      );
    }

    const user = await this.usersService.findOne(createVacationDto.criadoPor);

    const vacation = this.vacationRepository.create({
      dataInicio: dataInicioDate,
      dataFim: dataFimDate,
      funcionario: employee,
      criadoPor: user,
    });

    await this.vacationRepository.save(vacation);

    return vacation.id;
  }

  async findAll(employeeId: number) {
    const employee = await this.employeesService.findOne(employeeId);

    const vacations = await this.vacationRepository.find({
      where: {
        funcionario: { id: employee.id },
        status: 'A',
      },
    });

    return plainToInstance(VacationResponseDto, vacations, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number) {
    const vacation = await this.vacationRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!vacation) {
      throw new NotFoundException('Férias não encontrada.');
    }

    return plainToInstance(VacationResponseDto, vacation, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, updateVacationDto: UpdateVacationDto) {
    const { dataInicio, dataFim } = updateVacationDto;

    const dataInicioDate = new Date(dataInicio);
    const dataFimDate = new Date(dataFim);

    if (dataFimDate <= dataInicioDate) {
      throw new BadRequestException(
        'A data fim deve ser posterior à data início.',
      );
    }

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

    return this.findOne(id);
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

    return { id, status: 'E' };
  }
}
