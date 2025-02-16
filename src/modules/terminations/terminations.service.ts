import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTerminationDto } from './dto/create-termination.dto';
import { UpdateTerminationDto } from './dto/update-termination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Termination } from './entities/termination.entity';
import { EmployeesService } from '../employees/employees.service';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { TerminationResponseDto } from './dto/termination-response.dto';
import { BaseDeleteDto } from 'src/common/utils/dto/base-delete.dto';
import { UsersService } from '../users/users.service';
import { UpdateStatusDto } from '../employees/dto/update-status-employee.dto';
import { StatusFuncionario } from '../employees/enums/employees.enum';

@Injectable()
export class TerminationsService {
  constructor(
    @InjectRepository(Termination)
    private readonly terminationRepository: Repository<Termination>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
  ) {}

  async create(employeeId: number, createTerminationDto: CreateTerminationDto) {
    const employee = await this.employeesService.findOne(employeeId);

    const user = await this.usersService.findOne(
      createTerminationDto.criadoPor,
    );

    const termination = this.terminationRepository.create({
      ...createTerminationDto,
      funcionario: employee,
      criadoPor: user,
    });

    await this.terminationRepository.save(termination);

    const updateStatusDto: UpdateStatusDto = {
      statusFuncionario: StatusFuncionario.DEMITIDO,
      atualizadoPor: user.id,
    };

    await this.employeesService.updateEmployeeStatus(
      employeeId,
      updateStatusDto,
    );

    return termination.id;
  }

  async findAll(employeeId: number) {
    const employee = await this.employeesService.findOne(employeeId);

    const terminations = await this.terminationRepository.find({
      where: {
        funcionario: { id: employee.id },
        status: 'A',
      },
    });

    return plainToInstance(TerminationResponseDto, terminations, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number) {
    const termination = await this.terminationRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!termination) {
      throw new NotFoundException('Demissão não encontrada.');
    }

    return plainToInstance(TerminationResponseDto, termination);
  }

  async findEmployeeByTermination(id: number) {
    const termination = await this.terminationRepository.findOne({
      where: {
        id,
      },
      relations: ['funcionario'],
    });

    if (!termination) {
      throw new NotFoundException('Demissão não encontrada.');
    }

    const employee = this.employeesService.findOne(termination.funcionario.id);

    return employee;
  }

  async update(id: number, updateTerminationDto: UpdateTerminationDto) {
    const user = await this.usersService.findOne(
      updateTerminationDto.atualizadoPor,
    );

    const result = await this.terminationRepository.update(id, {
      ...updateTerminationDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Demissão não encontrada.');
    }

    return this.findOne(id);
  }

  async remove(id: number, deleteTerminationDto: BaseDeleteDto) {
    const user = await this.usersService.findOne(
      deleteTerminationDto.excluidoPor,
    );

    const result = await this.terminationRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Demissão não encontrada.');
    }

    const employee = await this.findEmployeeByTermination(id);

    const updateStatusDto: UpdateStatusDto = {
      statusFuncionario: StatusFuncionario.ATIVO,
      atualizadoPor: user.id,
    };

    await this.employeesService.updateEmployeeStatus(
      employee.id,
      updateStatusDto,
    );

    return { id, status: 'E' };
  }
}
