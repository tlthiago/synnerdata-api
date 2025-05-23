import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCpfAnalysisDto } from './dto/create-cpf-analysis.dto';
import { UpdateCpfAnalysisDto } from './dto/update-cpf-analysis.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CpfAnalysis } from './entities/cpf-analysis.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { CpfAnalysisResponseDto } from './dto/cpf-analysis-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CpfAnalysisService {
  constructor(
    @InjectRepository(CpfAnalysis)
    private readonly cpfAnalysisRepository: Repository<CpfAnalysis>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    employeeId: string,
    createCpfAnalysisDto: CreateCpfAnalysisDto,
    createdBy: string,
  ) {
    const employee = await this.employeesService.findOne(employeeId);

    const user = await this.usersService.findOne(createdBy);

    const cpfAnalysis = this.cpfAnalysisRepository.create({
      ...createCpfAnalysisDto,
      funcionario: { id: employee.id },
      criadoPor: user,
    });

    await this.cpfAnalysisRepository.save(cpfAnalysis);

    return plainToInstance(CpfAnalysisResponseDto, cpfAnalysis, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(employeeId: string) {
    const employee = await this.employeesService.findOne(employeeId);

    const cpfAnalysis = await this.cpfAnalysisRepository.find({
      where: {
        funcionario: { id: employee.id },
        status: 'A',
      },
    });

    return plainToInstance(CpfAnalysisResponseDto, cpfAnalysis, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const cpfAnalysis = await this.cpfAnalysisRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!cpfAnalysis) {
      throw new NotFoundException('Análise de CPF não encontrada.');
    }

    return plainToInstance(CpfAnalysisResponseDto, cpfAnalysis, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateCpfAnalysisDto: UpdateCpfAnalysisDto,
    updatedBy: string,
  ) {
    const user = await this.usersService.findOne(updatedBy);

    const result = await this.cpfAnalysisRepository.update(id, {
      ...updateCpfAnalysisDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Análise de CPF não encontrada.');
    }

    const updatedCpfAnalysis = await this.findOne(id);

    return updatedCpfAnalysis;
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.cpfAnalysisRepository.update(
      {
        id,
        status: 'A',
      },
      {
        status: 'E',
        atualizadoPor: user,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException(
        'Análise de CPF já excluída ou não encontrada.',
      );
    }

    const removedCpfAnalysis = await this.cpfAnalysisRepository.findOne({
      where: { id },
    });

    return plainToInstance(CpfAnalysisResponseDto, removedCpfAnalysis, {
      excludeExtraneousValues: true,
    });
  }
}
