import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCpfAnalysisDto } from './dto/create-cpf-analysis.dto';
import { UpdateCpfAnalysisDto } from './dto/update-cpf-analysis.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CpfAnalysis } from './entities/cpf-analysis.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { CpfAnalysisResponseDto } from './dto/cpf-analysis-response.dto';
import { BaseDeleteDto } from 'src/common/utils/dto/base-delete.dto';

@Injectable()
export class CpfAnalysisService {
  constructor(
    @InjectRepository(CpfAnalysis)
    private readonly cpfAnalysisRepository: Repository<CpfAnalysis>,
    private readonly employeesService: EmployeesService,
  ) {}

  async create(employeeId: number, createCpfAnalysisDto: CreateCpfAnalysisDto) {
    const employee = await this.employeesService.findOne(employeeId);

    const cpfAnalysis = this.cpfAnalysisRepository.create({
      ...createCpfAnalysisDto,
      funcionario: employee,
    });

    await this.cpfAnalysisRepository.save(cpfAnalysis);

    return cpfAnalysis.id;
  }

  async findAll(employeeId: number) {
    await this.employeesService.findOne(employeeId);

    const cpfAnalysis = await this.cpfAnalysisRepository.find({
      where: {
        funcionario: { id: employeeId },
        status: 'A',
      },
    });

    return plainToInstance(CpfAnalysisResponseDto, cpfAnalysis);
  }

  async findOne(id: number) {
    const cpfAnalysis = await this.cpfAnalysisRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    return plainToInstance(CpfAnalysisResponseDto, cpfAnalysis);
  }

  async update(id: number, updateCpfAnalysisDto: UpdateCpfAnalysisDto) {
    const result = await this.cpfAnalysisRepository.update(id, {
      ...updateCpfAnalysisDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Análise de CPF não encontrada.');
    }

    return `A análise de CPF #${id} foi atualizada.`;
  }

  async remove(id: number, deleteCpfAnalysisDto: BaseDeleteDto) {
    const result = await this.cpfAnalysisRepository.update(id, {
      status: 'E',
      atualizadoPor: deleteCpfAnalysisDto.excluidoPor,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Análise de CPF não encontrada.');
    }

    return `A análise de CPF #${id} foi excluída.`;
  }
}
