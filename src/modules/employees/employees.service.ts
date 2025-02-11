import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompaniesService } from '../companies/companies.service';
import { Employee } from './entities/employee.entity';
import { plainToInstance } from 'class-transformer';
import { In, Repository } from 'typeorm';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(companyId: number, createEmployeeDto: CreateEmployeeDto) {
    const company = await this.companiesService.findOne(companyId);

    const cpfExists = await this.findEmployeeBYCpf(createEmployeeDto.cpf);

    if (cpfExists) {
      throw new ConflictException(
        'Já existe um funcionário cadastrado para esse CPF.',
      );
    }
    const employee = this.employeesRepository.create({
      ...createEmployeeDto,
      empresa: company,
      dataNascimento: new Date(createEmployeeDto.dataNascimento),
    });
    await this.employeesRepository.save(employee);
  }

  async findEmployeeBYCpf(cpf: string): Promise<boolean> {
    const employee = await this.employeesRepository.findOne({
      where: {
        cpf,
      },
    });
    return !!employee;
  }

  async findAll(companyId: number) {
    await this.companiesService.findOne(companyId);
    const employee = await this.employeesRepository.find({
      where: {
        empresa: { id: companyId },
      },
    });

    return plainToInstance(CreateEmployeeDto, employee);
  }

  async findOne(id: number) {
    const employee = await this.employeesRepository.findOne({
      where: {
        id,
      },
    });
    if (!employee) throw new NotFoundException('Funcionário não encontrado');

    return employee;
  }

  async findByIds(ids: number[]) {
    return await this.employeesRepository.findBy({
      id: In(ids),
    });
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const result = await this.employeesRepository.update(id, {
      ...updateEmployeeDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Funcionário não escontrada');
    }

    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }

  async updateEmployeeStatus(id: number, status: string, updatedBy: number) {
    const employee = await this.employeesRepository.findOne({
      where: {
        id,
      },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    const result = await this.employeesRepository.update(id, {
      status,
      atualizadoPor: updatedBy,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    return `Status do funcionário #${id} atualizado para ${status}.`;
  }
}
