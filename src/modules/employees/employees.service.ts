import { Injectable, NotFoundException } from '@nestjs/common';
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
import { UpdateStatusDto } from './dto/update-status-employee.dto';
import { Role } from '../roles/entities/role.entity';
import { Department } from '../departments/entities/department.entity';
import { CostCenter } from '../cost-centers/entities/cost-center.entity';
import { Cbo } from '../cbos/entities/cbo.entity';
import { UsersResponseDto } from '../users/dto/user-response.dto';

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

  async create(
    companyId: string,
    createEmployeeDto: CreateEmployeeDto,
    createdBy: string,
  ) {
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

    const user = await this.usersService.findOne(createdBy);

    const employee = this.employeesRepository.create({
      ...createEmployeeDto,
      empresa: { id: company.id },
      funcao: { id: role.id },
      setor: { id: department.id },
      centroCusto: costCenter ? { id: costCenter.id } : null,
      cbo: { id: cbo.id },
      dataNascimento: new Date(createEmployeeDto.dataNascimento),
      dataAdmissao: new Date(createEmployeeDto.dataAdmissao),
      dataUltimoASO: createEmployeeDto.dataUltimoASO
        ? new Date(createEmployeeDto.dataUltimoASO)
        : null,
      dataExameAdmissional: createEmployeeDto.dataExameAdmissional
        ? new Date(createEmployeeDto.dataExameAdmissional)
        : null,
      vencimentoExperiencia1: createEmployeeDto.vencimentoExperiencia1
        ? new Date(createEmployeeDto.vencimentoExperiencia1)
        : null,
      vencimentoExperiencia2: createEmployeeDto.vencimentoExperiencia2
        ? new Date(createEmployeeDto.vencimentoExperiencia2)
        : null,
      dataExameDemissional: createEmployeeDto.dataExameDemissional
        ? new Date(createEmployeeDto.dataExameDemissional)
        : null,
      criadoPor: user,
    });

    await this.employeesRepository.save(employee);

    return plainToInstance(EmployeeResponseDto, employee, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(companyId: string) {
    const company = await this.companiesService.findOne(companyId);

    const employees = await this.employeesRepository.find({
      where: {
        empresa: { id: company.id },
        status: 'A',
      },
    });

    return plainToInstance(EmployeeResponseDto, employees, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const employee = await this.employeesRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    return plainToInstance(EmployeeResponseDto, employee, {
      excludeExtraneousValues: true,
    });
  }

  async findByCpf(cpf: string) {
    const employee = await this.employeesRepository.findOne({
      where: {
        cpf,
      },
    });

    return employee;
  }

  async findByIds(ids: string[]) {
    const employees = await this.employeesRepository.findBy({
      id: In(ids),
    });

    if (employees.length === 0) {
      throw new NotFoundException('Funcionário(s) não encontrado(s).');
    }

    return employees;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
    updatedBy: string,
  ) {
    const user = await this.usersService.findOne(updatedBy);

    let role: Role;
    let department: Department;
    let costCenter: CostCenter;
    let cbo: Cbo;

    if (updateEmployeeDto.funcao) {
      role = await this.rolesService.findOneInternal(updateEmployeeDto.funcao);
    }

    if (updateEmployeeDto.setor) {
      department = await this.departmentsService.findOneInternal(
        updateEmployeeDto.setor,
      );
    }

    if (updateEmployeeDto.centroCusto) {
      costCenter = await this.costCentersService.findOneInternal(
        updateEmployeeDto.centroCusto,
      );
    }

    if (updateEmployeeDto.cbo) {
      cbo = await this.cbosService.findOneInternal(updateEmployeeDto.cbo);
    }

    const result = await this.employeesRepository.update(id, {
      ...updateEmployeeDto,
      funcao: role,
      setor: department,
      centroCusto: costCenter,
      cbo: cbo,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    const updatedEmployee = await this.findOne(id);

    return updatedEmployee;
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.employeesRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Funcionário já excluído ou não encontrado.');
    }

    const removedEmployee = await this.employeesRepository.findOne({
      where: { id },
    });

    return plainToInstance(EmployeeResponseDto, removedEmployee, {
      excludeExtraneousValues: true,
    });
  }

  async updateEmployeeStatus(
    id: string,
    updateStatusDto: UpdateStatusDto,
    updatedBy: string,
  ) {
    const user = await this.usersService.findOne(updatedBy);

    const result = await this.employeesRepository.update(id, {
      ...updateStatusDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    return this.findOne(id);
  }

  async updateEmployeeRole(id: string, role: Role, user: UsersResponseDto) {
    const result = await this.employeesRepository.update(id, {
      funcao: role,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    return this.findOne(id);
  }
}
