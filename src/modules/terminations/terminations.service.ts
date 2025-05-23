import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTerminationDto } from './dto/create-termination.dto';
import { UpdateTerminationDto } from './dto/update-termination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Termination } from './entities/termination.entity';
import { EmployeesService } from '../employees/employees.service';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { TerminationResponseDto } from './dto/termination-response.dto';
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

  async create(
    employeeId: string,
    createTerminationDto: CreateTerminationDto,
    createdBy: string,
  ) {
    const employee = await this.employeesService.findOne(employeeId);

    const user = await this.usersService.findOne(createdBy);

    const termination = this.terminationRepository.create({
      ...createTerminationDto,
      funcionario: { id: employee.id },
      criadoPor: user,
    });

    await this.terminationRepository.save(termination);

    const updateStatusDto: UpdateStatusDto = {
      statusFuncionario: StatusFuncionario.DEMITIDO,
    };

    await this.employeesService.updateEmployeeStatus(
      employeeId,
      updateStatusDto,
      user.id,
    );

    return plainToInstance(TerminationResponseDto, termination, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(employeeId: string) {
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

  async findOne(id: string) {
    const termination = await this.terminationRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!termination) {
      throw new NotFoundException('Demissão não encontrada.');
    }

    return plainToInstance(TerminationResponseDto, termination, {
      excludeExtraneousValues: true,
    });
  }

  async findEmployeeByTermination(id: string) {
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

  async update(
    id: string,
    updateTerminationDto: UpdateTerminationDto,
    updatedBy: string,
  ) {
    const user = await this.usersService.findOne(updatedBy);

    const result = await this.terminationRepository.update(id, {
      ...updateTerminationDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Demissão não encontrada.');
    }

    const updatedTermination = await this.findOne(id);

    return updatedTermination;
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.terminationRepository.update(
      { id, status: 'A' },
      {
        status: 'E',
        atualizadoPor: user,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Demissão já excluída ou não encontrada.');
    }

    const employee = await this.findEmployeeByTermination(id);

    const updateStatusDto: UpdateStatusDto = {
      statusFuncionario: StatusFuncionario.ATIVO,
    };

    await this.employeesService.updateEmployeeStatus(
      employee.id,
      updateStatusDto,
      user.id,
    );

    const removedTermination = await this.terminationRepository.findOne({
      where: { id },
    });

    return plainToInstance(TerminationResponseDto, removedTermination, {
      excludeExtraneousValues: true,
    });
  }
}
