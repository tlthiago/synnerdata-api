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
import { UsersService } from '../users/users.service';

@Injectable()
export class VacationsService {
  constructor(
    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    employeeId: string,
    createVacationDto: CreateVacationDto,
    createdBy: string,
  ) {
    const employee = await this.employeesService.findOne(employeeId);

    const { dataInicio, dataFim } = createVacationDto;

    const dataInicioDate = new Date(dataInicio);
    const dataFimDate = new Date(dataFim);

    if (dataFimDate <= dataInicioDate) {
      throw new BadRequestException(
        'A data fim deve ser posterior à data início.',
      );
    }

    const user = await this.usersService.findOne(createdBy);

    const vacation = this.vacationRepository.create({
      dataInicio: dataInicioDate,
      dataFim: dataFimDate,
      funcionario: { id: employee.id },
      criadoPor: user,
    });

    await this.vacationRepository.save(vacation);

    return plainToInstance(VacationResponseDto, vacation, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(employeeId: string) {
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

  async findOne(id: string) {
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

  async update(
    id: string,
    updateVacationDto: UpdateVacationDto,
    updatedBy: string,
  ) {
    const { dataInicio, dataFim } = updateVacationDto;

    const dataInicioDate = new Date(dataInicio);
    const dataFimDate = new Date(dataFim);

    if (dataFimDate <= dataInicioDate) {
      throw new BadRequestException(
        'A data fim deve ser posterior à data início.',
      );
    }

    const user = await this.usersService.findOne(updatedBy);

    const result = await this.vacationRepository.update(id, {
      ...updateVacationDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Férias não encontrada.');
    }

    const updatedVacation = await this.findOne(id);

    return updatedVacation;
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.vacationRepository.update(
      { id, status: 'A' },
      {
        status: 'E',
        atualizadoPor: user,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Férias já excluída ou não encontrada.');
    }

    const removedVacation = this.vacationRepository.findOne({
      where: { id },
    });

    return plainToInstance(VacationResponseDto, removedVacation, {
      excludeExtraneousValues: true,
    });
  }
}
