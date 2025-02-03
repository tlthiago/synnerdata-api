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

@Injectable()
export class TerminationsService {
  constructor(
    @InjectRepository(Termination)
    private readonly terminationRepository: Repository<Termination>,
    private readonly employeesService: EmployeesService,
  ) {}

  async create(employeeId: number, createTerminationDto: CreateTerminationDto) {
    const employee = await this.employeesService.findOne(employeeId);

    const termination = this.terminationRepository.create({
      ...createTerminationDto,
      funcionario: employee,
    });

    await this.terminationRepository.save(termination);

    const status = 'D';

    await this.employeesService.updateEmployeeStatus(
      employeeId,
      status,
      createTerminationDto.criadoPor,
    );

    return termination.id;
  }

  async findAll(employeeId: number) {
    await this.employeesService.findOne(employeeId);

    const terminations = await this.terminationRepository.find({
      where: {
        funcionario: { id: employeeId },
        status: 'A',
      },
    });

    return plainToInstance(TerminationResponseDto, terminations);
  }

  async findOne(id: number) {
    const termination = await this.terminationRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    return plainToInstance(TerminationResponseDto, termination);
  }

  async findEmployeeByTermination(id: number) {
    const termination = await this.terminationRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!termination) {
      throw new NotFoundException('Demissão não encontrada.');
    }

    return termination.funcionario;
  }

  async update(id: number, updateTerminationDto: UpdateTerminationDto) {
    const result = await this.terminationRepository.update(id, {
      ...updateTerminationDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Demissão não encontrada.');
    }

    return `A demissão #${id} foi atualizada.`;
  }

  async remove(id: number, deleteTerminationDto: BaseDeleteDto) {
    const result = await this.terminationRepository.update(id, {
      status: 'E',
      atualizadoPor: deleteTerminationDto.excluidoPor,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Demissão não encontrada.');
    }

    const employee = await this.findEmployeeByTermination(id);

    const status = 'A';

    await this.employeesService.updateEmployeeStatus(
      employee.id,
      status,
      deleteTerminationDto.excluidoPor,
    );

    return `A demissão #${id} foi excluída.`;
  }
}
