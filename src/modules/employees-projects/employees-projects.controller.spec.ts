import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { MockAuthGuard } from '../../common/guards/mock-auth.guard';
import { Company } from './../companies/entities/company.entity';
import { Branch } from '../branches/entities/branch.entity';
import { Department } from '../departments/entities/department.entity';
import { CostCenter } from '../cost-centers/entities/cost-center.entity';
import { Cbo } from '../../modules/cbos/entities/cbo.entity';
import { Epi } from '../../modules/epis/entities/epi.entity';
import { Role } from '../roles/entities/role.entity';
import { Project } from '../projects/entities/project.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Absence } from '../absence/entities/absence.entity';
import { MedicalCertificate } from '../medical-certificate/entities/medical-certificate.entity';
import { Promotion } from '../promotion/entities/promotion.entity';
import { Termination } from '../terminations/entities/termination.entity';
import { CpfAnalysis } from '../cpf-analysis/entities/cpf-analysis.entity';
import { Accident } from '../accidents/entities/accident.entity';
import { Warning } from '../warnings/entities/warning.entity';
import { LaborAction } from '../labor-actions/entities/labor-action.entity';
import { EpiDelivery } from '../epi-delivery/entities/epi-delivery.entity';
import { Vacation } from '../vacations/entities/vacation.entity';
import { Funcao, User } from '../users/entities/user.entity';
import {
  Escala,
  EstadoCivil,
  GrauInstrucao,
  RegimeContratacao,
  Sexo,
} from '../employees/enums/employees.enum';
import { EmployeesProjectsModule } from './employees-projects.module';
import {
  EmployeeProjectAction,
  EmployeeProjectLogs,
} from './entities/project-employee-logs.entity';
import { MockUserInterceptor } from '../../common/interceptors/mock-user.interceptor';

describe('LaborActionsController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let mockUserInterceptor: MockUserInterceptor;
  let createdUser: User;
  let createdEmployee: Employee;
  let createdEmployee1: Employee;
  let createdProject: Project;

  const employeesProject = {
    funcionarios: ['1'],
    dataInicio: '2025-02-17',
  };

  beforeAll(async () => {
    pgContainer = await new PostgreSqlContainer().start();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: pgContainer.getConnectionUri(),
          autoLoadEntities: true,
          synchronize: true,
          entities: [
            Company,
            Branch,
            Department,
            CostCenter,
            Cbo,
            Epi,
            Role,
            Project,
            Employee,
            Absence,
            MedicalCertificate,
            Promotion,
            Termination,
            CpfAnalysis,
            Accident,
            Warning,
            LaborAction,
            EpiDelivery,
            Vacation,
          ],
        }),
        EmployeesProjectsModule,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(new MockAuthGuard())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    mockUserInterceptor = new MockUserInterceptor();
    app.useGlobalInterceptors(mockUserInterceptor);
    await app.init();

    dataSource = app.get(DataSource);

    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);
    const departmentRepository = dataSource.getRepository(Department);
    const companyRepository = dataSource.getRepository(Company);
    const cboRepository = dataSource.getRepository(Cbo);
    const employeeRepository = dataSource.getRepository(Employee);
    const projectRepository = dataSource.getRepository(Project);

    const user = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste1@example.com',
      senha: 'senha123',
      funcao: Funcao.ADMIN,
    });
    createdUser = await userRepository.save(user);

    mockUserInterceptor.setUserId(createdUser.id);

    const company = companyRepository.create({
      nomeFantasia: 'Tech Solutions',
      razaoSocial: 'Tech Solutions LTDA',
      cnpj: '12345678004175',
      rua: 'Rua da Tecnologia',
      numero: '123',
      complemento: 'Sala 45',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01000-000',
      dataFundacao: '2010-05-15',
      email: 'contato@techsolutions.com.br',
      celular: '+5531991897926',
    });
    const createdCompany = await companyRepository.save(company);

    const role = roleRepository.create({
      nome: 'Função Teste',
    });
    const createdRole = await roleRepository.save(role);

    const department = departmentRepository.create({
      nome: 'Departamento Teste',
    });
    const createdDepartment = await departmentRepository.save(department);

    const cbo = cboRepository.create({
      nome: 'Cbo Teste',
    });
    const createdCbo = await cboRepository.save(cbo);

    const employee = employeeRepository.create({
      nome: 'Funcionário Teste',
      carteiraIdentidade: 'MG-18.821.128',
      cpf: '13420162626',
      sexo: Sexo.MASCULINO,
      dataNascimento: '1996-10-15',
      estadoCivil: EstadoCivil.SOLTEIRO,
      naturalidade: 'Belo Horizonte',
      nacionalidade: 'Brasileiro',
      altura: 1.73,
      peso: 73.3,
      nomePai: 'Nome do Pai',
      nomeMae: 'Nome da Mãe',
      email: 'email@teste.com.br',
      pis: '12345678910',
      ctpsNumero: '1234567',
      ctpsSerie: '1234',
      certificadoReservista: '12345678910203',
      regimeContratacao: RegimeContratacao.CLT,
      dataAdmissao: '2025-02-12',
      salario: 3799,
      dataUltimoASO: '2025-02-12',
      funcao: createdRole,
      setor: createdDepartment,
      grauInstrucao: GrauInstrucao.SUPERIOR,
      necessidadesEspeciais: false,
      filhos: false,
      celular: '31991897926',
      gestor: 'Gestor Teste',
      cbo: createdCbo,
      rua: 'Rua Teste',
      numero: '1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01000-000',
      quantidadeOnibus: 1,
      cargaHoraria: 60,
      escala: Escala.SEIS_UM,
      empresa: createdCompany,
    });
    createdEmployee = await employeeRepository.save(employee);

    employeesProject.funcionarios = [createdEmployee.id];

    const employee1 = employeeRepository.create({
      nome: 'Funcionário Teste',
      carteiraIdentidade: 'MG-18.821.128',
      cpf: '13420162627',
      sexo: Sexo.MASCULINO,
      dataNascimento: '1996-10-15',
      estadoCivil: EstadoCivil.SOLTEIRO,
      naturalidade: 'Belo Horizonte',
      nacionalidade: 'Brasileiro',
      altura: 1.73,
      peso: 73.3,
      nomePai: 'Nome do Pai',
      nomeMae: 'Nome da Mãe',
      email: 'email@teste.com.br',
      pis: '12345678910',
      ctpsNumero: '1234567',
      ctpsSerie: '1234',
      certificadoReservista: '12345678910203',
      regimeContratacao: RegimeContratacao.CLT,
      dataAdmissao: '2025-02-12',
      salario: 3799,
      dataUltimoASO: '2025-02-12',
      funcao: createdRole,
      setor: createdDepartment,
      grauInstrucao: GrauInstrucao.SUPERIOR,
      necessidadesEspeciais: false,
      filhos: false,
      celular: '31991897926',
      gestor: 'Gestor Teste',
      cbo: createdCbo,
      rua: 'Rua Teste',
      numero: '1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01000-000',
      quantidadeOnibus: 1,
      cargaHoraria: 60,
      escala: Escala.SEIS_UM,
      empresa: createdCompany,
    });
    createdEmployee1 = await employeeRepository.save(employee1);

    const project = projectRepository.create({
      nome: 'Projeto Teste',
      descricao: 'Descrição Teste',
      dataInicio: '2025-01-29',
      cno: '123456734032',
      funcionarios: [createdEmployee],
    });
    createdProject = await projectRepository.save(project);
  }, 50000);

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.query(
        'DELETE FROM "funcionarios_projetos_logs" CASCADE;',
      );
    }
  });

  it('/v1/funcionarios/projetos/:projetoId (POST) - Deve cadastrar um funcionário em projeto', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/projetos/${createdProject.id}`)
      .send(employeesProject)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      succeeded: true,
      data: expect.objectContaining({
        funcionarios: expect.arrayContaining([
          expect.objectContaining({
            id: createdEmployee.id,
          }),
        ]),
      }),
      message: expect.stringContaining(
        'Funcionário(s) cadastrado(s) com sucesso no projeto, id: #',
      ),
    });

    const logsRepository = dataSource.getRepository(EmployeeProjectLogs);
    const logs = await logsRepository.find({
      where: {
        projeto: { id: createdProject.id },
        funcionario: { id: createdEmployee.id },
      },
    });

    expect(logs.length).toBe(1);
    expect(logs[0]).toMatchObject({
      acao: EmployeeProjectAction.ADICIONOU,
      descricao: `O funcionário ${createdEmployee.id} foi adicionado no projeto ${createdProject.id}`,
      criadoPor: createdUser.id,
    });
  });

  it('/v1/funcionarios/projetos/:projetoId (POST) - Deve retornar erro ao criar um funcionário em projeto sem informações obrigatórias', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/projetos/${createdProject.id}`)
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining(['dataInicio should not be empty']),
    );
  });

  it('/v1/funcionarios/projetos/:projetoId (POST) - Deve retornar erro ao criar um funcionário em projeto com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/projetos/${createdProject.id}`)
      .send({ ...employeesProject, dataInicio: 123 })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'dataInicio must be a valid ISO 8601 date string',
      ]),
    );
  });

  it('/v1/funcionarios/projetos/:projetoId (POST) - Deve retornar erro caso o ID do projeto não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/projetos/86f226c4-38b0-464c-987e-35293033faf6`)
      .send({
        ...employeesProject,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Projeto não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/projetos/:projetoId (POST) - Deve retornar erro caso o ID do funcionário não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/projetos/${createdProject.id}`)
      .send({
        ...employeesProject,
        funcionarios: ['86f226c4-38b0-464c-987e-35293033faf6'],
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Funcionário(s) não encontrado(s).',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/projetos/:projetoId (POST) - Deve retornar erro caso o ID do funcionário seja inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/projetos/${createdProject.id}`)
      .send({
        ...employeesProject,
        funcionarios: ['999'],
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: ['each value in funcionarios must be a UUID'],
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/:funcionarioId/projetos (GET) - Deve listar todos os projetos que um funcionário está cadastrado', async () => {
    const projectRepository = dataSource.getRepository(Project);
    await projectRepository.save({
      ...createdProject,
      funcionarios: [createdEmployee],
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/${createdEmployee.id}/projetos`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/funcionarios/:funcionarioId/projetos (GET) - Deve retornar erro ao buscar um funcionário inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/86f226c4-38b0-464c-987e-35293033faf6/projetos`)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Funcionário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/:funcionarioId/projetos (GET) - Deve retornar erro ao buscar um funcionário em projeto com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/funcionarios/999/projetos')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/projetos/:id (PATCH) - Deve atualizar os funcionários em um projeto', async () => {
    const updateData = {
      funcionarios: [createdEmployee1.id],
      dataInicio: '2025-02-18',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/projetos/${createdProject.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: expect.objectContaining({
        funcionarios: expect.arrayContaining([
          expect.objectContaining({
            id: createdEmployee1.id,
          }),
        ]),
      }),
      message: `Funcionário(s) do projeto id: #${createdProject.id} atualizado(s) com sucesso.`,
    });

    const logsRepository = dataSource.getRepository(EmployeeProjectLogs);
    const logs = await logsRepository.find({
      where: {
        projeto: { id: createdProject.id },
      },
    });

    expect(logs.length).toBe(2);
    expect(logs[0]).toMatchObject({
      acao: EmployeeProjectAction.REMOVEU,
      descricao: `O funcionário ${createdEmployee.id} foi removido do projeto ${createdProject.id}`,
      criadoPor: createdUser.id,
    });
    expect(logs[1]).toMatchObject({
      acao: EmployeeProjectAction.ADICIONOU,
      descricao: `O funcionário ${createdEmployee1.id} foi adicionado no projeto ${createdProject.id}`,
      criadoPor: createdUser.id,
    });
  });

  it('/v1/funcionarios/acoes-trabalhistas/:id (PATCH) - Deve retornar um erro ao atualizar um funcionário em projeto com tipo de dado inválido', async () => {
    const updateData = {
      funcionarios: '999',
      dataInicio: '2025-02-18',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/projetos/${createdProject.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['funcionarios must be an array']),
    );
  });

  it('/v1/funcionarios/acoes-trabalhistas/:id (PATCH) - Deve retornar erro caso o ID do funcionário não exista', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/projetos/${createdProject.id}`)
      .send({
        funcionarios: ['86f226c4-38b0-464c-987e-35293033faf6'],
        dataInicio: '2025-02-18',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Funcionário(s) não encontrado(s).',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/acoes-trabalhistas/:id (PATCH) - Deve retornar erro ao atualizar um funcionário em projeto com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/projetos/999`)
      .send({
        funcionarios: [createdEmployee1.id],
        dataInicio: '2025-02-18',
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/acoes-trabalhistas/:id (PATCH) - Deve retornar erro ao atualizar um funcionário em projeto inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/funcionarios/projetos/86f226c4-38b0-464c-987e-35293033faf6')
      .send({
        funcionarios: [createdEmployee1.id],
        dataInicio: '2025-02-18',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Projeto não encontrado.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
