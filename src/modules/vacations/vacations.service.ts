import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { Vacation } from './entities/vacation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { VacationResponseDto } from './dto/vacation-response.dto';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class VacationsService {
  constructor(
    @InjectRepository(Vacation)
    private readonly vacationRepository: Repository<Vacation>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
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

    const overlappingVacation = await this.vacationRepository.findOne({
      where: {
        funcionario: { id: employeeId },
        dataInicio: LessThanOrEqual(dataFimDate),
        dataFim: MoreThanOrEqual(dataInicioDate),
      },
    });

    if (overlappingVacation) {
      throw new ConflictException(
        'Já existe uma férias cadastrada que colide com o período informado.',
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

    return await this.findOne(vacation.id);
  }

  async findAllByCompany(companyId: string) {
    const company = await this.companiesService.findById(companyId);

    const absences = await this.vacationRepository
      .createQueryBuilder('ferias')
      .innerJoinAndSelect('ferias.funcionario', 'funcionario')
      .innerJoinAndSelect('ferias.criadoPor', 'criadoPor')
      .leftJoinAndSelect('ferias.atualizadoPor', 'atualizadoPor')
      .innerJoin('funcionario.empresa', 'empresa')
      .where('empresa.id = :companyId', { companyId: company.id })
      .andWhere('ferias.status = :status', { status: 'A' })
      .getMany();

    return plainToInstance(VacationResponseDto, absences, {
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
      relations: ['funcionario'],
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
      relations: ['funcionario'],
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
    const existingVacation = await this.vacationRepository.findOne({
      where: { id },
      relations: ['funcionario'],
    });

    if (!existingVacation) {
      throw new NotFoundException('Férias não encontrada.');
    }

    const { dataInicio, dataFim } = updateVacationDto;

    const dataInicioDate = new Date(dataInicio);
    const dataFimDate = new Date(dataFim);

    if (dataFimDate <= dataInicioDate) {
      throw new BadRequestException(
        'A data fim deve ser posterior à data início.',
      );
    }

    const overlappingVacation = await this.vacationRepository.findOne({
      where: {
        id: Not(id),
        funcionario: { id: existingVacation.funcionario.id },
        dataInicio: LessThanOrEqual(dataFimDate),
        dataFim: MoreThanOrEqual(dataInicioDate),
      },
    });

    if (overlappingVacation) {
      throw new ConflictException(
        'Já existe uma férias cadastrada que colide com o período informado.',
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

    return await this.findOne(id);
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
      relations: ['funcionario'],
    });

    return plainToInstance(VacationResponseDto, removedVacation, {
      excludeExtraneousValues: true,
    });
  }
}
