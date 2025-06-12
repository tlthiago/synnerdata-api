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
import { VacationsModule } from './vacations.module';
import { MockUserInterceptor } from '../../common/interceptors/mock-user.interceptor';

describe('VacationController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let mockUserInterceptor: MockUserInterceptor;
  let createdUser: User;
  let createdCompany: Company;
  let createdEmployee: Employee;

  const vacation = {
    dataInicio: '2025-02-10',
    dataFim: '2025-02-14',
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
        VacationsModule,
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
  }, 50000);

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.query('DELETE FROM "ferias" CASCADE;');
    }
  });

  it('/v1/funcionarios/:funcionarioId/ferias (POST) - Deve cadastrar uma férias', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/ferias`)
      .send(vacation)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        dataInicio: expect.any(String),
      },
      message: expect.stringContaining('Férias cadastrada com sucesso, id: #'),
    });
  });

  it('/v1/funcionarios/:funcionarioId/ferias (POST) - Deve retornar erro ao tentar cadastrar uma férias em um período já existente', async () => {
    const vacationRepository = dataSource.getRepository(Vacation);
    await vacationRepository.save({
      dataInicio: new Date('2025-02-10'),
      dataFim: new Date('2025-02-14'),
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/ferias`)
      .send({
        dataInicio: '2025-02-12',
        dataFim: '2025-02-18',
      })
      .expect(409);

    expect(response.body).toMatchObject({
      statusCode: 409,
      message:
        'Já existe uma férias cadastrada que colide com o período informado.',
      error: 'Conflict',
    });
  });

  it('/v1/funcionarios/:funcionarioId/ferias (POST) - Deve retornar erro ao criar uma férias sem informações obrigatórias', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/ferias`)
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining(['dataInicio should not be empty']),
    );
  });

  it('/v1/funcionarios/:funcionarioId/ferias (POST) - Deve retornar erro ao criar uma férias com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/ferias`)
      .send({ ...vacation, dataInicio: 123 })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'dataInicio must be a valid ISO 8601 date string',
      ]),
    );
  });

  it('/v1/funcionarios/:funcionarioId/ferias (POST) - Deve retornar erro ao criar uma férias com data fim anterior a data início', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/ferias`)
      .send({
        ...vacation,
        dataInicio: '2025-02-14',
        dataFim: '2025-02-10',
      })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      'A data fim deve ser posterior à data início.',
    );
  });

  it('/v1/funcionarios/:funcionarioId/ferias (POST) - Deve retornar erro caso o ID do funcionário não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/86f226c4-38b0-464c-987e-35293033faf6/ferias`)
      .send({
        ...vacation,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Funcionário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/ferias (GET) - Deve listar todas as férias de uma empresa', async () => {
    const vacationRepository = dataSource.getRepository(Vacation);
    await vacationRepository.save({
      ...vacation,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/${createdCompany.id}/ferias`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/empresas/:empresaId/ferias (GET) - Deve retornar erro caso o ID da empresa não exista', async () => {
    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/86f226c4-38b0-464c-987e-35293033faf6/ferias`)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/:funcionarioId/ferias (GET) - Deve listar todas as férias de um funcionário', async () => {
    const vacationRepository = dataSource.getRepository(Vacation);
    await vacationRepository.save({
      ...vacation,
      funcionario: createdEmployee,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/${createdEmployee.id}/ferias`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/funcionarios/:funcionarioId/ferias (GET) - Deve retornar erro caso o ID do funcionário não exista', async () => {
    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/86f226c4-38b0-464c-987e-35293033faf6/ferias`)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Funcionário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/ferias/:id (GET) - Deve retonar uma férias específica', async () => {
    const vacationRepository = dataSource.getRepository(Vacation);
    const createdVacation = await vacationRepository.save({
      ...vacation,
      funcionario: createdEmployee,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/ferias/${createdVacation.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdVacation.id,
      dataInicio: new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
      }).format(new Date(createdVacation.dataInicio)),
    });
  });

  it('/v1/funcionarios/ferias/:id (GET) - Deve retornar erro ao buscar uma férias inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/funcionarios/ferias/86f226c4-38b0-464c-987e-35293033faf6')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Férias não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/ferias/:id (GET) - Deve retornar erro ao buscar uma férias com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/funcionarios/ferias/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/ferias/:id (PATCH) - Deve atualizar os dados de uma férias', async () => {
    const vacationRepository = dataSource.getRepository(Vacation);
    const createdVacation = await vacationRepository.save({
      ...vacation,
      funcionario: createdEmployee,
    });

    const updateData = {
      dataInicio: '2025-02-09',
      dataFim: '2025-02-13',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/ferias/${createdVacation.id}`)
      .send(updateData)
      .expect(200);

    const formattedInitialDate = new Date(
      updateData.dataInicio,
    ).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const formattedFinalDate = new Date(updateData.dataFim).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      },
    );

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdVacation.id,
        dataInicio: formattedInitialDate,
        dataFim: formattedFinalDate,
        atualizadoPor: createdUser.nome,
      },
      message: `Férias id: #${createdVacation.id} atualizada com sucesso.`,
    });
  });

  it('/v1/ferias/:id (PATCH) - Deve retornar erro ao tentar atualizar para um período que já existe', async () => {
    const vacationRepository = dataSource.getRepository(Vacation);
    await vacationRepository.save({
      dataInicio: new Date('2025-03-01'),
      dataFim: new Date('2025-03-10'),
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const vacationToUpdate = await vacationRepository.save({
      dataInicio: new Date('2025-04-01'),
      dataFim: new Date('2025-04-05'),
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/ferias/${vacationToUpdate.id}`)
      .send({
        dataInicio: '2025-03-05',
        dataFim: '2025-03-12',
      })
      .expect(409);

    expect(response.body).toMatchObject({
      statusCode: 409,
      message:
        'Já existe uma férias cadastrada que colide com o período informado.',
      error: 'Conflict',
    });
  });

  it('/v1/funcionarios/ferias/:id (PATCH) - Deve retornar um erro ao atualizar uma férias com tipo de dado inválido', async () => {
    const vacationRepository = dataSource.getRepository(Vacation);
    const createdVacation = await vacationRepository.save({
      ...vacation,
      funcionario: createdEmployee,
    });

    const updateData = {
      dataInicio: 123,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/ferias/${createdVacation.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'dataInicio must be a valid ISO 8601 date string',
      ]),
    );
  });

  it('/v1/funcionarios/ferias/:id (PATCH) - Deve retornar um erro ao atualizar uma férias com data fim anterior a data início', async () => {
    const vacationRepository = dataSource.getRepository(Vacation);
    const createdVacation = await vacationRepository.save({
      ...vacation,
      funcionario: createdEmployee,
    });

    const updateData = {
      dataInicio: '2025-02-16',
      dataFim: '2025-02-11',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/ferias/${createdVacation.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      'A data fim deve ser posterior à data início.',
    );
  });

  it('/v1/funcionarios/ferias/:id (PATCH) - Deve retornar erro ao atualizar uma férias com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/funcionarios/ferias/abc')
      .send({
        dataInicio: '2025-02-11',
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/ferias/:id (PATCH) - Deve retornar erro ao atualizar uma férias inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/funcionarios/ferias/86f226c4-38b0-464c-987e-35293033faf6')
      .send({
        dataInicio: '2025-02-11',
        dataFim: '2025-02-14',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Férias não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/ferias/:id (DELETE) - Deve excluir uma férias', async () => {
    const vacationRepository = dataSource.getRepository(Vacation);
    const createdVacation = await vacationRepository.save({
      ...vacation,
      funcionario: createdEmployee,
    });

    const response = await request(app.getHttpServer())
      .delete(`/v1/funcionarios/ferias/${createdVacation.id}`)
      .expect(200);

    const formattedInitialDate = new Date(
      vacation.dataInicio,
    ).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdVacation.id,
        dataInicio: formattedInitialDate,
        atualizadoPor: createdUser.nome,
        status: 'E',
      },
      message: `Férias id: #${createdVacation.id} excluída com sucesso.`,
    });
  });

  it('/v1/funcionarios/ferias/:id (DELETE) - Deve retornar erro ao excluir uma férias com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/funcionarios/ferias/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/ferias/:id (DELETE) - Deve retornar erro ao excluir uma férias inexistente', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/funcionarios/ferias/86f226c4-38b0-464c-987e-35293033faf6')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Férias já excluída ou não encontrada.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
