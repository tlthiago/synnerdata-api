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
import { RolesService } from '../roles/roles.service';
import { DepartmentsService } from '../departments/departments.service';
import { CostCentersService } from '../cost-centers/cost-centers.service';
import { CostCenterResponseDto } from '../cost-centers/dto/cost-center-response.dto';
import { UsersService } from '../users/users.service';
import { CbosService } from '../cbos/cbos.service';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import { RoleResponseDto } from '../roles/dto/role-response.dto';
import { DepartmentResponseDto } from '../departments/dto/department-response.dto';
import { CboResponseDto } from '../cbos/dto/cbo-response.dto';
import { UpdateStatusDto } from './dto/update-status-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
    private readonly companiesService: CompaniesService,
    private readonly rolesService: RolesService,
    private readonly departmentsService: DepartmentsService,
    private readonly costCentersService: CostCentersService,
    private readonly cbosService: CbosService,
    private readonly usersService: UsersService,
  ) {}

  async create(companyId: number, createEmployeeDto: CreateEmployeeDto) {
    const company = await this.companiesService.findOne(companyId);
    const role = await this.rolesService.findOne(createEmployeeDto.funcao);
    const department = await this.departmentsService.findOne(
      createEmployeeDto.setor,
    );
    let costCenter: CostCenterResponseDto;

    if (createEmployeeDto.centroCusto) {
      costCenter = await this.costCentersService.findOne(
        createEmployeeDto.centroCusto,
      );
    }

    const cbo = await this.cbosService.findOne(createEmployeeDto.cbo);

    const user = await this.usersService.findOne(createEmployeeDto.criadoPor);

    const cpfExists = await this.findByCpf(createEmployeeDto.cpf);

    if (cpfExists) {
      throw new ConflictException(
        'Já existe um funcionário cadastrado com o mesmo número de CPF.',
      );
    }

    const employee = this.employeesRepository.create({
      ...createEmployeeDto,
      empresa: company,
      funcao: role,
      setor: department,
      centroCusto: costCenter,
      cbo: cbo,
      dataNascimento: new Date(createEmployeeDto.dataNascimento),
      dataAdmissao: new Date(createEmployeeDto.dataAdmissao),
      dataUltimoASO: new Date(createEmployeeDto.dataUltimoASO),
      vencimentoExperiencia1: new Date(
        createEmployeeDto.vencimentoExperiencia1,
      ),
      vencimentoExperiencia2: new Date(
        createEmployeeDto.vencimentoExperiencia2,
      ),
      dataExameDemissional: new Date(createEmployeeDto.dataExameDemissional),
      criadoPor: user,
    });

    await this.employeesRepository.save(employee);

    return employee.id;
  }

  async findAll(companyId: number) {
    const company = await this.companiesService.findOne(companyId);

    const employees = await this.employeesRepository.find({
      where: {
        empresa: { id: company.id },
      },
    });

    return plainToInstance(EmployeeResponseDto, employees, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number) {
    const employee = await this.employeesRepository.findOne({
      where: {
        id,
      },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    return plainToInstance(EmployeeResponseDto, employee, {
      excludeExtraneousValues: true,
    });
  }

  async findByCpf(cpf: string): Promise<boolean> {
    const employee = await this.employeesRepository.findOne({
      where: {
        cpf,
      },
    });

    return !!employee;
  }

  async findByIds(ids: number[]) {
    const employees = await this.employeesRepository.findBy({
      id: In(ids),
    });

    if (employees.length === 0) {
      throw new NotFoundException('Funcionário(s) não encontrado(s).');
    }

    return employees;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const user = await this.usersService.findOne(
      updateEmployeeDto.atualizadoPor,
    );

    let role: RoleResponseDto;
    let department: DepartmentResponseDto;
    let costCenter: CostCenterResponseDto;
    let cbo: CboResponseDto;

    if (updateEmployeeDto.funcao) {
      role = await this.rolesService.findOne(updateEmployeeDto.funcao);
    }

    if (updateEmployeeDto.setor) {
      department = await this.departmentsService.findOne(
        updateEmployeeDto.setor,
      );
    }

    if (updateEmployeeDto.centroCusto) {
      costCenter = await this.costCentersService.findOne(
        updateEmployeeDto.centroCusto,
      );
    }

    if (updateEmployeeDto.cbo) {
      cbo = await this.cbosService.findOne(updateEmployeeDto.cbo);
    }

    if (updateEmployeeDto.cpf) {
      const cpfExists = await this.findByCpf(updateEmployeeDto.cpf);

      if (cpfExists) {
        throw new ConflictException(
          'Já existe um funcionário cadastrado com o mesmo número de CPF.',
        );
      }
    }

    const result = await this.employeesRepository.update(id, {
      ...updateEmployeeDto,
      funcao: role,
      setor: department,
      centroCusto: costCenter,
      cbo,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    return this.findOne(id);
  }

  async updateEmployeeStatus(id: number, updateStatusDto: UpdateStatusDto) {
    const user = await this.usersService.findOne(updateStatusDto.atualizadoPor);

    const result = await this.employeesRepository.update(id, {
      ...updateStatusDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    return this.findOne(id);
  }
}
