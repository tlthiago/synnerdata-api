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
import { Project } from '../../modules/projects/entities/project.entity';
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
import { EmployeesModule } from './employees.module';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {
  Escala,
  EstadoCivil,
  GrauInstrucao,
  RegimeContratacao,
  Sexo,
} from './enums/employees.enum';
import { MockUserInterceptor } from '../../common/interceptors/mock-user.interceptor';

describe('FuncionárioController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let mockUserInterceptor: MockUserInterceptor;
  let createdUser: User;
  let createdCompany: Company;
  let createdRole: Role;
  let createdDepartment: Department;
  let createdCbo: Cbo;

  const employee = {
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
    funcao: '1',
    setor: '1',
    grauInstrucao: GrauInstrucao.SUPERIOR,
    necessidadesEspeciais: false,
    filhos: false,
    celular: '31991897926',
    gestor: 'Gestor Teste',
    cbo: '1',
    rua: 'Rua Teste',
    numero: '1000',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01000-000',
    quantidadeOnibus: 1,
    cargaHoraria: 60,
    escala: Escala.SEIS_UM,
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
        EmployeesModule,
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
    const companyRepository = dataSource.getRepository(Company);
    const roleRepository = dataSource.getRepository(Role);
    const departmentRepository = dataSource.getRepository(Department);
    const cboRepository = dataSource.getRepository(Cbo);

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
    createdCompany = await companyRepository.save(company);

    const role = roleRepository.create({
      nome: 'Função Teste',
      criadoPor: user,
    });
    createdRole = await roleRepository.save(role);

    const department = departmentRepository.create({
      nome: 'Setor Teste',
      criadoPor: user,
    });
    createdDepartment = await departmentRepository.save(department);

    const cbo = cboRepository.create({
      nome: 'Cbo Teste',
      criadoPor: user,
    });
    createdCbo = await cboRepository.save(cbo);

    employee.funcao = createdRole.id;
    employee.setor = createdDepartment.id;
    employee.cbo = createdCbo.id;
  }, 50000);

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.query('DELETE FROM "funcionarios" CASCADE;');
    }
  });

  it('/v1/empresas/:empresaId/funcionarios (POST) - Deve cadastrar um funcionário', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcionarios`)
      .send(employee)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        nome: employee.nome,
      },
      message: expect.stringContaining(
        'Funcionário cadastrado com sucesso, id: #',
      ),
    });
  });

  it('/v1/empresas/:empresaId/funcionarios (POST) - Deve retornar erro ao criar um funcionário sem informações obrigatórias', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcionarios`)
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome should not be empty']),
    );
  });

  it('/v1/empresas/:empresaId/funcionarios (POST) - Deve retornar erro ao criar um funcionário com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcionarios`)
      .send({ ...employee, nome: 123 })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome must be a string']),
    );
  });

  it('/v1/empresas/:empresaId/funcionarios (POST) - Deve retornar erro caso o ID da empresa não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/86f226c4-38b0-464c-987e-35293033faf6/funcionarios`)
      .send({
        ...employee,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/funcionarios (POST) - Deve retornar erro caso o ID da função seja inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcionarios`)
      .send({
        ...employee,
        funcao: 123,
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: ['funcao must be a UUID'],
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/:empresaId/funcionarios (POST) - Deve retornar erro caso o ID da função não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcionarios`)
      .send({
        ...employee,
        funcao: '86f226c4-38b0-464c-987e-35293033faf6',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Função não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/funcionarios (POST) - Deve retornar erro caso o ID do setor seja inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcionarios`)
      .send({
        ...employee,
        setor: 999,
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: ['setor must be a UUID'],
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/:empresaId/funcionarios (POST) - Deve retornar erro caso o ID do setor não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcionarios`)
      .send({
        ...employee,
        setor: '86f226c4-38b0-464c-987e-35293033faf6',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Setor não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/funcionarios (POST) - Deve retornar erro caso o ID do centro de custo seja inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcionarios`)
      .send({
        ...employee,
        centroCusto: 999,
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: ['centroCusto must be a UUID'],
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/:empresaId/funcionarios (POST) - Deve retornar erro caso o ID do centro de custo não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcionarios`)
      .send({
        ...employee,
        centroCusto: '86f226c4-38b0-464c-987e-35293033faf6',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Centro de custo não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/funcionarios (POST) - Deve retornar erro caso o ID do cbo seja inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcionarios`)
      .send({
        ...employee,
        cbo: 999,
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: ['cbo must be a UUID'],
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/:empresaId/funcionarios (POST) - Deve retornar erro caso o ID do cbo não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcionarios`)
      .send({
        ...employee,
        cbo: '86f226c4-38b0-464c-987e-35293033faf6',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Cbo não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/funcionarios (POST) - Deve retornar erro caso o CPF já exista', async () => {
    const employeeRepository = dataSource.getRepository(Employee);
    await employeeRepository.save({
      ...employee,
      funcao: createdRole,
      setor: createdDepartment,
      cbo: createdCbo,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcionarios`)
      .send({
        ...employee,
      })
      .expect(409);

    expect(response.body).toEqual({
      statusCode: 409,
      message: 'Já existe um funcionário cadastrado com o mesmo número de CPF.',
      error: 'Conflict',
    });
  });

  it('/v1/empresas/:empresaId/funcionarios (GET) - Deve listar todos os funcionarios de uma empresa', async () => {
    const employeeRepository = dataSource.getRepository(Employee);
    await employeeRepository.save({
      ...employee,
      funcao: createdRole,
      setor: createdDepartment,
      cbo: createdCbo,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/${createdCompany.id}/funcionarios`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/empresas/funcionarios/:id (GET) - Deve retonar um funcionário específico', async () => {
    const employeeRepository = dataSource.getRepository(Employee);
    const createdEmployee = await employeeRepository.save({
      ...employee,
      funcao: createdRole,
      setor: createdDepartment,
      cbo: createdCbo,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/funcionarios/${createdEmployee.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdEmployee.id,
      nome: createdEmployee.nome,
    });
  });

  it('/v1/empresas/funcionarios/:id (GET) - Deve retornar erro ao buscar um funcionário inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/empresas/funcionarios/86f226c4-38b0-464c-987e-35293033faf6')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Funcionário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/funcionarios/:id (GET) - Deve retornar erro ao buscar um funcionário com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/empresas/funcionarios/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/funcionarios/:id (PATCH) - Deve atualizar os dados de um funcionário', async () => {
    const employeeRepository = dataSource.getRepository(Employee);
    const createdEmployee = await employeeRepository.save({
      ...employee,
      funcao: createdRole,
      setor: createdDepartment,
      cbo: createdCbo,
      empresa: createdCompany,
    });

    const updateData: UpdateEmployeeDto = {
      nome: 'Funcionário Atualizado',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcionarios/${createdEmployee.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdEmployee.id,
        nome: updateData.nome,
        atualizadoPor: createdUser.nome,
      },
      message: `Funcionário id: #${createdEmployee.id} atualizado com sucesso.`,
    });
  });

  it('/v1/empresas/funcionarios/:id (PATCH) - Deve retornar um erro ao atualizar um funcionário com tipo de dado inválido', async () => {
    const employeeRepository = dataSource.getRepository(Employee);
    const createdEmployee = await employeeRepository.save({
      ...employee,
      funcao: createdRole,
      setor: createdDepartment,
      cbo: createdCbo,
      empresa: createdCompany,
    });

    const updateData = {
      nome: 123,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcionarios/${createdEmployee.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome must be a string']),
    );
  });

  it('/v1/empresas/funcionarios/:id (PATCH) - Deve retornar um erro ao atualizar um funcionário caso o ID da função não exista', async () => {
    const employeeRepository = dataSource.getRepository(Employee);
    const createdEmployee = await employeeRepository.save({
      ...employee,
      funcao: createdRole,
      setor: createdDepartment,
      cbo: createdCbo,
      empresa: createdCompany,
    });

    const updateData = {
      funcao: 999,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcionarios/${createdEmployee.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: ['funcao must be a UUID'],
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/funcionarios/:id (PATCH) - Deve retornar um erro ao atualizar um funcionário caso o ID da função não exista', async () => {
    const employeeRepository = dataSource.getRepository(Employee);
    const createdEmployee = await employeeRepository.save({
      ...employee,
      funcao: createdRole,
      setor: createdDepartment,
      cbo: createdCbo,
      empresa: createdCompany,
    });

    const updateData = {
      funcao: '86f226c4-38b0-464c-987e-35293033faf6',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcionarios/${createdEmployee.id}`)
      .send(updateData)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Função não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/funcionarios/:id (PATCH) - Deve retornar um erro ao atualizar um funcionário caso o ID do setor seja inválido', async () => {
    const employeeRepository = dataSource.getRepository(Employee);
    const createdEmployee = await employeeRepository.save({
      ...employee,
      funcao: createdRole,
      setor: createdDepartment,
      cbo: createdCbo,
      empresa: createdCompany,
    });

    const updateData = {
      setor: 999,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcionarios/${createdEmployee.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: ['setor must be a UUID'],
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/funcionarios/:id (PATCH) - Deve retornar um erro ao atualizar um funcionário caso o ID do setor não exista', async () => {
    const employeeRepository = dataSource.getRepository(Employee);
    const createdEmployee = await employeeRepository.save({
      ...employee,
      funcao: createdRole,
      setor: createdDepartment,
      cbo: createdCbo,
      empresa: createdCompany,
    });

    const updateData = {
      setor: '86f226c4-38b0-464c-987e-35293033faf6',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcionarios/${createdEmployee.id}`)
      .send(updateData)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Setor não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/funcionarios/:id (PATCH) - Deve retornar um erro ao atualizar um funcionário caso o ID do centro de custo seja inválido', async () => {
    const employeeRepository = dataSource.getRepository(Employee);
    const createdEmployee = await employeeRepository.save({
      ...employee,
      funcao: createdRole,
      setor: createdDepartment,
      cbo: createdCbo,
      empresa: createdCompany,
    });

    const updateData = {
      centroCusto: 999,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcionarios/${createdEmployee.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: ['centroCusto must be a UUID'],
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/funcionarios/:id (PATCH) - Deve retornar um erro ao atualizar um funcionário caso o ID do centro de custo não exista', async () => {
    const employeeRepository = dataSource.getRepository(Employee);
    const createdEmployee = await employeeRepository.save({
      ...employee,
      funcao: createdRole,
      setor: createdDepartment,
      cbo: createdCbo,
      empresa: createdCompany,
    });

    const updateData = {
      centroCusto: '86f226c4-38b0-464c-987e-35293033faf6',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcionarios/${createdEmployee.id}`)
      .send(updateData)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Centro de custo não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/funcionarios/:id (PATCH) - Deve retornar um erro ao atualizar um funcionário caso o ID do cbo seja inválido', async () => {
    const employeeRepository = dataSource.getRepository(Employee);
    const createdEmployee = await employeeRepository.save({
      ...employee,
      funcao: createdRole,
      setor: createdDepartment,
      cbo: createdCbo,
      empresa: createdCompany,
    });

    const updateData = {
      cbo: 999,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcionarios/${createdEmployee.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: ['cbo must be a UUID'],
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/funcionarios/:id (PATCH) - Deve retornar um erro ao atualizar um funcionário caso o ID do cbo não exista', async () => {
    const employeeRepository = dataSource.getRepository(Employee);
    const createdEmployee = await employeeRepository.save({
      ...employee,
      funcao: createdRole,
      setor: createdDepartment,
      cbo: createdCbo,
      empresa: createdCompany,
    });

    const updateData = {
      cbo: '86f226c4-38b0-464c-987e-35293033faf6',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcionarios/${createdEmployee.id}`)
      .send(updateData)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Cbo não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/funcionarios/:id (PATCH) - Deve retornar um erro ao atualizar um funcionário caso o CPF já exista', async () => {
    const employeeRepository = dataSource.getRepository(Employee);
    const createdEmployee = await employeeRepository.save({
      ...employee,
      funcao: createdRole,
      setor: createdDepartment,
      cbo: createdCbo,
      empresa: createdCompany,
    });

    const updateData = {
      cpf: '13420162626',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcionarios/${createdEmployee.id}`)
      .send(updateData)
      .expect(409);

    expect(response.body).toEqual({
      statusCode: 409,
      message: 'Já existe um funcionário cadastrado com o mesmo número de CPF.',
      error: 'Conflict',
    });
  });

  it('/v1/empresas/funcionarios/:id (PATCH) - Deve retornar erro ao atualizar um funcionário com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/funcionarios/abc')
      .send({
        nome: 'Funcionário Atualizado',
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/funcionarios/:id (PATCH) - Deve retornar erro ao atualizar um funcionário inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/funcionarios/86f226c4-38b0-464c-987e-35293033faf6')
      .send({
        nomeFantasia: 'Funcionário Inexistente',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Funcionário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/funcionarios/:id (DELETE) - Deve excluir um funcionário', async () => {
    const employeeRepository = dataSource.getRepository(Employee);
    const createdEmployee = await employeeRepository.save({
      ...employee,
      funcao: createdRole,
      setor: createdDepartment,
      cbo: createdCbo,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/funcionarios/${createdEmployee.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdEmployee.id,
        nome: createdEmployee.nome,
        atualizadoPor: createdUser.nome,
        status: 'E',
      },
      message: `Funcionário id: #${createdEmployee.id} excluído com sucesso.`,
    });
  });

  it('/v1/empresas/funcionarios/:id (DELETE) - Deve retornar erro ao excluir um funcionário com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/funcionarios/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/funcionarios/:id (DELETE) - Deve retornar erro ao excluir um funcionário inexistente', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/funcionarios/86f226c4-38b0-464c-987e-35293033faf6')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Funcionário já excluído ou não encontrado.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
