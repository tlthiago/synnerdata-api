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
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class CpfAnalysisService {
  constructor(
    @InjectRepository(CpfAnalysis)
    private readonly cpfAnalysisRepository: Repository<CpfAnalysis>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
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

    return await this.findOne(cpfAnalysis.id);
  }

  async findAllByCompany(companyId: string) {
    const company = await this.companiesService.findById(companyId);

    const absences = await this.cpfAnalysisRepository
      .createQueryBuilder('analise_de_cpf')
      .innerJoinAndSelect('analise_de_cpf.funcionario', 'funcionario')
      .innerJoinAndSelect('analise_de_cpf.criadoPor', 'criadoPor')
      .leftJoinAndSelect('analise_de_cpf.atualizadoPor', 'atualizadoPor')
      .innerJoin('funcionario.empresa', 'empresa')
      .where('empresa.id = :companyId', { companyId: company.id })
      .andWhere('analise_de_cpf.status = :status', { status: 'A' })
      .getMany();

    return plainToInstance(CpfAnalysisResponseDto, absences, {
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
      relations: ['funcionario'],
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
      relations: ['funcionario'],
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

    return await this.findOne(id);
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
      relations: ['funcionario'],
    });

    return plainToInstance(CpfAnalysisResponseDto, removedCpfAnalysis, {
      excludeExtraneousValues: true,
    });
  }
}
