import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCpfAnalysisDto } from './dto/create-cpf-analysis.dto';
import { UpdateCpfAnalysisDto } from './dto/update-cpf-analysis.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CpfAnalysis } from './entities/cpf-analysis.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { CpfAnalysisResponseDto } from './dto/cpf-analysis-response.dto';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CpfAnalysisService {
  constructor(
    @InjectRepository(CpfAnalysis)
    private readonly cpfAnalysisRepository: Repository<CpfAnalysis>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
  ) {}

  async create(employeeId: number, createCpfAnalysisDto: CreateCpfAnalysisDto) {
    const employee = await this.employeesService.findOne(employeeId);

    const user = await this.usersService.findOne(
      createCpfAnalysisDto.criadoPor,
    );

    const cpfAnalysis = this.cpfAnalysisRepository.create({
      ...createCpfAnalysisDto,
      funcionario: employee,
      criadoPor: user,
    });

    await this.cpfAnalysisRepository.save(cpfAnalysis);

    return cpfAnalysis.id;
  }

  async findAll(employeeId: number) {
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

  async findOne(id: number) {
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

  async update(id: number, updateCpfAnalysisDto: UpdateCpfAnalysisDto) {
    const user = await this.usersService.findOne(
      updateCpfAnalysisDto.atualizadoPor,
    );

    const result = await this.cpfAnalysisRepository.update(id, {
      ...updateCpfAnalysisDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Análise de CPF não encontrada.');
    }

    return this.findOne(id);
  }

  async remove(id: number, deleteCpfAnalysisDto: BaseDeleteDto) {
    const user = await this.usersService.findOne(
      deleteCpfAnalysisDto.excluidoPor,
    );

    const result = await this.cpfAnalysisRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Análise de CPF não encontrada.');
    }

    return { id, status: 'E' };
  }
}
