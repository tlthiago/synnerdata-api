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
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesResitory: Repository<Employee>,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(companyId: number, createEmployeeDto: CreateEmployeeDto) {
    const cpfExists = await this.findEmployeeBYCpf(createEmployeeDto.cpf);
    const company = await this.companiesService.findOne(companyId);
    if (cpfExists) {
      throw new ConflictException(
        'Já existe um funcionário cadastrado para esse CPF.',
      );
    }
    const employee = this.employeesResitory.create({
      ...createEmployeeDto,
      empresa: company,
      dataNascimento: new Date(createEmployeeDto.dataNascimento),
    });
    await this.employeesResitory.save(employee);
  }
  async findEmployeeBYCpf(cpf: string): Promise<boolean> {
    const employee = await this.employeesResitory.findOne({
      where: {
        cpf,
      },
    });
    return !!employee;
  }

  async findAll(companyId: number) {
    await this.companiesService.findOne(companyId);
    const employee = await this.employeesResitory.find({
      where: {
        empresa: { id: companyId },
      },
    });

    return plainToInstance(CreateEmployeeDto, employee);
  }

  async findOne(id: number) {
    const employee = await this.employeesResitory.findOne({
      where: {
        id,
      },
    });
    if (!employee) throw new NotFoundException('Funcionário não encontrado');

    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const result = await this.employeesResitory.update(id, {
      ...updateEmployeeDto,
    });
    if (result.affected === 0) {
      throw new NotFoundException('Funcionário não escontrada');
    }
    return `Funcionário #${id} atualizado.`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
