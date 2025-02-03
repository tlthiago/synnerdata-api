import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesResitory: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const cpfExists = await this.findEmployeeBYCpf(createEmployeeDto.cpf);

    if (cpfExists) {
      throw new ConflictException(
        'Já existe um funcionário cadastrado para esse CPF.',
      );
    }
    const employee = this.employeesResitory.create({
      ...createEmployeeDto,
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

  findAll() {
    return this.employeesResitory.find();
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
    const employee = await this.employeesResitory.findOne({
      where: {
        id: id,
      },
    });
    if (!employee) {
      throw new NotFoundException('Funcionário não escontrada');
    }
    const result = await this.employeesResitory.update(id, {
      ...updateEmployeeDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Funcionário não encontrado');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }

  async updateEmployeeStatus(id: number, status: string, updatedBy: number) {
    const employee = await this.employeesResitory.findOne({
      where: {
        id,
      },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    const result = await this.employeesResitory.update(id, {
      status,
      atualizadoPor: updatedBy,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    return `Status do funcionário #${id} atualizado para ${status}.`;
  }
}
