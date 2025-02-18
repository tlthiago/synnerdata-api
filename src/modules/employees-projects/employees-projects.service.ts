import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeesProjectDto } from './dto/create-employees-project.dto';
import { UpdateEmployeesProjectDto } from './dto/update-employees-project.dto';
import {
  EmployeeProjectAction,
  EmployeeProjectLogs,
} from './entities/project-employee-logs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { Project } from '../projects/entities/project.entity';
import { plainToInstance } from 'class-transformer';
import {
  EmployeeProjectsResponseDto,
  EmployeesProjectResponseDto,
} from './dto/employee-projects-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class EmployeesProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    projectId: number,
    createEmployeesProjectDto: CreateEmployeesProjectDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const project = await queryRunner.manager.findOne(Project, {
        where: { id: projectId },
        relations: ['funcionarios'],
      });

      if (!project) {
        throw new NotFoundException('Projeto não encontrado.');
      }

      const employees = await this.employeesService.findByIds(
        createEmployeesProjectDto.funcionarios,
      );

      project.funcionarios = employees;
      await queryRunner.manager.save(project);

      const user = await this.usersService.findOne(
        createEmployeesProjectDto.criadoPor,
      );

      const logs = employees.map((employee) => ({
        projeto: project,
        funcionario: employee,
        dataInicio: createEmployeesProjectDto.dataInicio,
        acao: EmployeeProjectAction.ADICIONOU,
        descricao: `O funcionário ${employee.id} foi adicionado no projeto ${project.id}`,
        criadoPor: user.id,
      }));

      await queryRunner.manager.save(EmployeeProjectLogs, logs);

      await queryRunner.commitTransaction();
      return project.id;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(employeeId: number) {
    const employee = await this.employeesService.findOne(employeeId);

    const projects = await this.projectRepository.find({
      where: { funcionarios: { id: employee.id }, status: 'A' },
      relations: ['funcionarios'],
    });

    const projectsWithTransformedEmployees = projects.map((project) => ({
      ...project,
      funcionarios: plainToInstance(
        EmployeesProjectResponseDto,
        project.funcionarios,
        {
          excludeExtraneousValues: true,
        },
      ),
    }));

    return plainToInstance(
      EmployeeProjectsResponseDto,
      projectsWithTransformedEmployees,
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async update(
    projectId: number,
    updateEmployeeProjectDto: UpdateEmployeesProjectDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const project = await queryRunner.manager.findOne(Project, {
        where: { id: projectId },
        relations: ['funcionarios'],
      });

      if (!project) {
        throw new NotFoundException('Projeto não encontrado.');
      }

      const currentEmployees = project.funcionarios;
      const newEmployees = await this.employeesService.findByIds(
        updateEmployeeProjectDto.funcionarios,
      );

      const addedEmployees = newEmployees.filter(
        (newEmployee) =>
          !currentEmployees.some((employee) => employee.id === newEmployee.id),
      );

      const removedEmployees = currentEmployees.filter(
        (employee) =>
          !newEmployees.some((newEmployee) => newEmployee.id === employee.id),
      );

      project.funcionarios = newEmployees;
      await queryRunner.manager.save(project);

      const user = await this.usersService.findOne(
        updateEmployeeProjectDto.atualizadoPor,
      );

      const removedEmployeesLogs = removedEmployees.map((employee) => ({
        projeto: project,
        funcionario: employee,
        dataInicio: updateEmployeeProjectDto.dataInicio,
        acao: EmployeeProjectAction.REMOVEU,
        descricao: `O funcionário ${employee.id} foi removido do projeto ${project.id}`,
        criadoPor: user.id,
      }));

      await queryRunner.manager.save(EmployeeProjectLogs, removedEmployeesLogs);

      const addedEmployeesLogs = addedEmployees.map((employee) => ({
        projeto: project,
        funcionario: employee,
        dataInicio: updateEmployeeProjectDto.dataInicio,
        acao: EmployeeProjectAction.ADICIONOU,
        descricao: `O funcionário ${employee.id} foi adicionado no projeto ${project.id}`,
        criadoPor: user.id,
      }));

      await queryRunner.manager.save(EmployeeProjectLogs, addedEmployeesLogs);

      await queryRunner.commitTransaction();
      return `O projeto #${project.id} foi atualizado.`;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
