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
import { LaborActionsModule } from './labor-actions.module';
import { MockUserInterceptor } from '../../common/interceptors/mock-user.interceptor';

describe('LaborActionsController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let mockUserInterceptor: MockUserInterceptor;
  let createdUser: User;
  let createdCompany: Company;
  let createdEmployee: Employee;

  const laborAction = {
    numeroProcesso: '123456789012',
    tribunal: 'Tribunal Regional do Trabalho da 1ª Região',
    dataAjuizamento: '2025-01-15',
    reclamante: 'João da Silva',
    reclamado: 'Empresa XYZ Ltda.',
    advogadoReclamante: 'Dr. Pedro Almeida',
    advogadoReclamado: 'Dra. Ana Costa',
    descricao:
      'Reclamação trabalhista por rescisão indireta e verbas rescisórias.',
    valorCausa: 25000.75,
    andamento: 'Audiência inicial realizada',
    decisao: 'Indeferido pedido de antecipação de tutela.',
    recursos: 'Recurso ordinário interposto pelo reclamante.',
    custasDespesas: 1200.5,
    dataConhecimento: '2025-01-10',
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
        LaborActionsModule,
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
      valorAlimentacao: 800,
      valorTransporte: 500,
      empresa: createdCompany,
    });
    createdEmployee = await employeeRepository.save(employee);
  }, 50000);

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.query('DELETE FROM "acoes_trabalhistas" CASCADE;');
    }
  });

  it('/v1/funcionarios/:funcionarioId/acoes-trabalhistas (POST) - Deve cadastrar uma ação trabalhista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/acoes-trabalhistas`)
      .send(laborAction)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        numeroProcesso: laborAction.numeroProcesso,
      },
      message: expect.stringContaining(
        'Ação trabalhista cadastrada com sucesso, id: #',
      ),
    });
  });

  it('/v1/funcionarios/:funcionarioId/acoes-trabalhistas (POST) - Deve retornar erro ao criar uma ação trabalhista sem informações obrigatórias', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/acoes-trabalhistas`)
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining(['dataAjuizamento should not be empty']),
    );
  });

  it('/v1/funcionarios/:funcionarioId/acoes-trabalhistas (POST) - Deve retornar erro ao criar uma ação trabalhista com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/acoes-trabalhistas`)
      .send({ ...laborAction, dataAjuizamento: 123 })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'dataAjuizamento must be a valid ISO 8601 date string',
      ]),
    );
  });

  it('/v1/funcionarios/:funcionarioId/acoes-trabalhistas (POST) - Deve retornar erro caso o ID do funcionário não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(
        `/v1/funcionarios/86f226c4-38b0-464c-987e-35293033faf6/acoes-trabalhistas`,
      )
      .send({
        ...laborAction,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Funcionário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/acoes-trabalhistas (GET) - Deve listar todas as ações trabalhistas de uma empresa', async () => {
    const laborActionRepository = dataSource.getRepository(LaborAction);
    await laborActionRepository.save({
      ...laborAction,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/${createdCompany.id}/acoes-trabalhistas`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/empresas/:empresaId/acoes-trabalhistas (GET) - Deve retornar erro caso o ID da empresa não exista', async () => {
    const response = await request(app.getHttpServer())
      .get(
        `/v1/empresas/86f226c4-38b0-464c-987e-35293033faf6/acoes-trabalhistas`,
      )
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/:funcionarioId/acoes-trabalhistas (GET) - Deve listar todas as ações trabalhistas de um funcionário', async () => {
    const laborActionRepository = dataSource.getRepository(LaborAction);
    await laborActionRepository.save({
      ...laborAction,
      funcionario: createdEmployee,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/${createdEmployee.id}/acoes-trabalhistas`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/funcionarios/:funcionarioId/acoes-trabalhistas (GET) - Deve retornar erro caso o ID do funcionário não exista', async () => {
    const response = await request(app.getHttpServer())
      .get(
        `/v1/funcionarios/86f226c4-38b0-464c-987e-35293033faf6/acoes-trabalhistas`,
      )
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Funcionário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/acoes-trabalhistas/:id (GET) - Deve retonar uma ação trabalhista específica', async () => {
    const laborActionRepository = dataSource.getRepository(LaborAction);
    const createdLaborAction = await laborActionRepository.save({
      ...laborAction,
      funcionario: createdEmployee,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/acoes-trabalhistas/${createdLaborAction.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdLaborAction.id,
      dataAjuizamento: new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
      }).format(new Date(createdLaborAction.dataAjuizamento)),
    });
  });

  it('/v1/funcionarios/acoes-trabalhistas/:id (GET) - Deve retornar erro ao buscar uma ação trabalhista inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get(
        '/v1/funcionarios/acoes-trabalhistas/86f226c4-38b0-464c-987e-35293033faf6',
      )
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Ação trabalhista não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/acoes-trabalhistas/:id (GET) - Deve retornar erro ao buscar uma ação trabalhista com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/funcionarios/acoes-trabalhistas/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/acoes-trabalhistas/:id (PATCH) - Deve atualizar os dados de uma ação trabalhista', async () => {
    const laborActionRepository = dataSource.getRepository(LaborAction);
    const createdLaborAction = await laborActionRepository.save({
      ...laborAction,
      funcionario: createdEmployee,
    });

    const updateData = {
      dataAjuizamento: new Date('2025-02-20T00:00:00-03:00'),
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/acoes-trabalhistas/${createdLaborAction.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdLaborAction.id,
        numeroProcesso: laborAction.numeroProcesso,
        atualizadoPor: createdUser.nome,
      },
      message: `Ação trabalhista id: #${createdLaborAction.id} atualizada com sucesso.`,
    });
  });

  it('/v1/funcionarios/acoes-trabalhistas/:id (PATCH) - Deve retornar um erro ao atualizar uma ação trabalhista com tipo de dado inválido', async () => {
    const laborActionRepository = dataSource.getRepository(LaborAction);
    const createdLaborAction = await laborActionRepository.save({
      ...laborAction,
      funcionario: createdEmployee,
    });

    const updateData = {
      dataAjuizamento: 123,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/acoes-trabalhistas/${createdLaborAction.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'dataAjuizamento must be a valid ISO 8601 date string',
      ]),
    );
  });

  it('/v1/funcionarios/acoes-trabalhistas/:id (PATCH) - Deve retornar erro ao atualizar uma ação trabalhista com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/funcionarios/acoes-trabalhistas/abc')
      .send({
        dataAjuizamento: '2025-02-11',
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/acoes-trabalhistas/:id (PATCH) - Deve retornar erro ao atualizar uma ação trabalhista inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch(
        '/v1/funcionarios/acoes-trabalhistas/86f226c4-38b0-464c-987e-35293033faf6',
      )
      .send({
        dataAjuizamento: '2025-02-11',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Ação trabalhista não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/acoes-trabalhistas/:id (DELETE) - Deve excluir uma ação trabalhista', async () => {
    const laborActionRepository = dataSource.getRepository(LaborAction);
    const createdLaborAction = await laborActionRepository.save({
      ...laborAction,
      funcionario: createdEmployee,
    });

    const response = await request(app.getHttpServer())
      .delete(`/v1/funcionarios/acoes-trabalhistas/${createdLaborAction.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdLaborAction.id,
        numeroProcesso: createdLaborAction.numeroProcesso,
        atualizadoPor: createdUser.nome,
        status: 'E',
      },
      message: `Ação trabalhista id: #${createdLaborAction.id} excluída com sucesso.`,
    });
  });

  it('/v1/funcionarios/acoes-trabalhistas/:id (DELETE) - Deve retornar erro ao excluir uma ação trabalhista com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/funcionarios/acoes-trabalhistas/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/acoes-trabalhistas/:id (DELETE) - Deve retornar erro ao excluir uma ação trabalhista inexistente', async () => {
    const response = await request(app.getHttpServer())
      .delete(
        '/v1/funcionarios/acoes-trabalhistas/86f226c4-38b0-464c-987e-35293033faf6',
      )
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Ação trabalhista já excluída ou não encontrada.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
