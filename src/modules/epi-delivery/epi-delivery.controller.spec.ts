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
import { Cbo } from '../cbos/entities/cbo.entity';
import { Role } from '../roles/entities/role.entity';
import { Epi } from '../epis/entities/epi.entity';
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
import { EpiDeliveryModule } from './epi-delivery.module';
import {
  Escala,
  EstadoCivil,
  GrauInstrucao,
  RegimeContratacao,
  Sexo,
} from '../employees/enums/employees.enum';
import { UpdateEpiDeliveryDto } from './dto/update-epi-delivery.dto';
import {
  EpiDeliveryAction,
  EpiDeliveryLogs,
} from './entities/delivery-epi-logs.entity';
import { MockUserInterceptor } from '../../common/interceptors/mock-user.interceptor';

describe('FunçãoController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let mockUserInterceptor: MockUserInterceptor;
  let createdUser: User;
  let createdEmployee: Employee;
  let createdCompany: Company;
  let createdEpi: Epi;
  let createdEpi1: Epi;

  const epiDelivery = {
    data: '2025-02-19',
    epis: ['1'],
    motivo: 'Motivo teste',
    entreguePor: 'Responsável teste',
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
        EpiDeliveryModule,
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
    const epiRepository = dataSource.getRepository(Epi);

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

    const epi = epiRepository.create({
      nome: 'Bota',
      descricao: 'Equipamento para pedreiro.',
      equipamentos: 'Exemplo',
    });
    createdEpi = await epiRepository.save(epi);

    const epi1 = epiRepository.create({
      nome: 'Capacete',
      descricao: 'Equipamento para pedreiro.',
      equipamentos: 'Exemplo',
    });
    createdEpi1 = await epiRepository.save(epi1);

    epiDelivery.epis = [createdEpi.id];
  }, 50000);

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.query('DELETE FROM "entregas_epis_logs" CASCADE;');
      await dataSource.query('DELETE FROM "entregas_de_epis" CASCADE;');
    }
  });

  it('/v1/funcionarios/:funcionarioId/entregas-de-epis (POST) - Deve cadastrar uma entrega de epi', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/entregas-de-epis`)
      .send(epiDelivery)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        motivo: epiDelivery.motivo,
      },
      message: expect.stringContaining(
        'Entrega de epis cadastrada com sucesso, id: #',
      ),
    });
  });

  it('/v1/funcionarios/:funcionarioId/entregas-de-epis (POST) - Deve retornar erro ao criar uma entrega de epi sem informações obrigatórias', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/entregas-de-epis`)
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining(['data should not be empty']),
    );
  });

  it('/v1/funcionarios/:funcionarioId/entregas-de-epis (POST) - Deve retornar erro ao criar uma entrega de epi com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/entregas-de-epis`)
      .send({ ...epiDelivery, data: 123 })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['data must be a valid ISO 8601 date string']),
    );
  });

  it('/v1/funcionarios/:funcionarioId/entregas-de-epis (POST) - Deve retornar erro caso o ID do funcionário não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(
        `/v1/funcionarios/86f226c4-38b0-464c-987e-35293033faf6/entregas-de-epis`,
      )
      .send({
        ...epiDelivery,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Funcionário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/:funcionarioId/entregas-de-epis (POST) - Deve retornar erro caso o ID do(s) epi(s) seja(s) inválido(s)', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/entregas-de-epis`)
      .send({
        ...epiDelivery,
        epis: ['999'],
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: ['O identificador do(s) epi(s) deve ser um número'],
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/:funcionarioId/entregas-de-epis (POST) - Deve retornar erro caso o ID do(s) epi(s) não exista(m)', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/entregas-de-epis`)
      .send({
        ...epiDelivery,
        epis: ['86f226c4-38b0-464c-987e-35293033faf6'],
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Epi(s) não encontrado(s).',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/entregas-de-epis (GET) - Deve listar todas as entregas de epis de uma empresa', async () => {
    const epiDeliveryRepository = dataSource.getRepository(EpiDelivery);
    await epiDeliveryRepository.save({
      ...epiDelivery,
      epis: [createdEpi],
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/${createdCompany.id}/entregas-de-epis`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/empresas/:empresaId/entregas-de-epis (GET) - Deve retornar erro caso o ID da empresa não exista', async () => {
    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/86f226c4-38b0-464c-987e-35293033faf6/entregas-de-epis`)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/:funcionarioId/entregas-de-epis (GET) - Deve listar todas as entregas de epis de um funcionário', async () => {
    const epiDeliveryRepository = dataSource.getRepository(EpiDelivery);
    await epiDeliveryRepository.save({
      ...epiDelivery,
      epis: [createdEpi],
      funcionario: createdEmployee,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/${createdEmployee.id}/entregas-de-epis`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/funcionarios/:funcionarioId/entregas-de-epis (GET) - Deve retornar erro caso o ID do funcionário não exista', async () => {
    const response = await request(app.getHttpServer())
      .get(
        `/v1/funcionarios/86f226c4-38b0-464c-987e-35293033faf6/entregas-de-epis`,
      )
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Funcionário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/entregas-de-epis/:id (GET) - Deve retonar uma entrega de epi específica', async () => {
    const epiDeliveryRepository = dataSource.getRepository(EpiDelivery);
    const createdEpiDelivery = await epiDeliveryRepository.save({
      ...epiDelivery,
      epis: [createdEpi],
      funcionario: createdEmployee,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/entregas-de-epis/${createdEpiDelivery.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdEpiDelivery.id,
      data: new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
      }).format(new Date(createdEpiDelivery.data)),
      epis: expect.arrayContaining([
        expect.objectContaining({
          id: createdEpi.id,
        }),
      ]),
    });
  });

  it('/v1/funcionarios/entregas-de-epis/:id (GET) - Deve retornar erro ao buscar uma entrega de epi inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get(
        '/v1/funcionarios/entregas-de-epis/86f226c4-38b0-464c-987e-35293033faf6',
      )
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Entrega de Epi(s) não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/entregas-de-epis/:id (GET) - Deve retornar erro ao buscar uma entrega de epi com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/funcionarios/entregas-de-epis/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/entregas-de-epis/:id (PATCH) - Deve atualizar os dados de uma entrega de epi', async () => {
    const epiDeliveryRepository = dataSource.getRepository(EpiDelivery);
    const createdEpiDelivery = await epiDeliveryRepository.save({
      ...epiDelivery,
      epis: [createdEpi],
      funcionario: createdEmployee,
    });

    const updateData: UpdateEpiDeliveryDto = {
      motivo: 'Motivo teste atualizado',
      epis: [createdEpi1.id],
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/entregas-de-epis/${createdEpiDelivery.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdEpiDelivery.id,
        motivo: updateData.motivo,
        epis: expect.arrayContaining([
          expect.objectContaining({
            id: createdEpi1.id,
          }),
        ]),
        atualizadoPor: createdUser.nome,
      },
      message: `Entrega de epis id: #${createdEpiDelivery.id} atualizada com sucesso.`,
    });

    const logsRepository = dataSource.getRepository(EpiDeliveryLogs);
    const logs = await logsRepository.find({
      where: {
        entregaDeEpi: {
          id: createdEpiDelivery.id,
        },
      },
      relations: ['entregaDeEpi', 'epi'],
    });

    expect(logs[0]).toMatchObject({
      acao: EpiDeliveryAction.REMOVEU,
      descricao: `O usuário ${createdUser.id} removeu o Epi ${createdEpi.id} da entrega ${createdEpiDelivery.id}.`,
      criadoPor: createdUser.id,
    });
  });

  it('/v1/funcionarios/entregas-de-epis/:id (PATCH) - Deve retornar um erro ao atualizar uma entrega de epi com tipo de dado inválido', async () => {
    const epiDeliveryRepository = dataSource.getRepository(EpiDelivery);
    const createdEpiDelivery = await epiDeliveryRepository.save({
      ...epiDelivery,
      epis: [createdEpi],
      funcionario: createdEmployee,
    });

    const updateData = {
      data: 123,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/entregas-de-epis/${createdEpiDelivery.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['data must be a valid ISO 8601 date string']),
    );
  });

  it('/v1/funcionarios/entregas-de-epis/:id (PATCH) - Deve retornar erro caso o ID do(s) epi(s) não exista(m)', async () => {
    const epiDeliveryRepository = dataSource.getRepository(EpiDelivery);
    const createdEpiDelivery = await epiDeliveryRepository.save({
      ...epiDelivery,
      epis: [createdEpi],
      funcionario: createdEmployee,
    });

    const updateData = {
      data: '2025-02-11',
      epis: ['86f226c4-38b0-464c-987e-35293033faf6'],
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/entregas-de-epis/${createdEpiDelivery.id}`)
      .send(updateData)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Epi(s) não encontrado(s).',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/entregas-de-epis/:id (PATCH) - Deve retornar erro ao atualizar uma entrega de epi com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/funcionarios/entregas-de-epis/abc')
      .send({
        data: '2025-02-11',
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/entregas-de-epis/:id (PATCH) - Deve retornar erro ao atualizar uma entrega de epi inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch(
        '/v1/funcionarios/entregas-de-epis/86f226c4-38b0-464c-987e-35293033faf6',
      )
      .send({
        data: '2025-02-11',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Entrega de Epi(s) não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/entregas-de-epis/:id (DELETE) - Deve excluir uma entrega de epi', async () => {
    const epiDeliveryRepository = dataSource.getRepository(EpiDelivery);
    const createdEpiDelivery = await epiDeliveryRepository.save({
      ...epiDelivery,
      epis: [createdEpi],
      funcionario: createdEmployee,
    });

    const response = await request(app.getHttpServer())
      .delete(`/v1/funcionarios/entregas-de-epis/${createdEpiDelivery.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdEpiDelivery.id,
        motivo: createdEpiDelivery.motivo,
        atualizadoPor: createdUser.nome,
        status: 'E',
      },
      message: `Entrega de epis id: #${createdEpiDelivery.id} excluída com sucesso.`,
    });
  });

  it('/v1/funcionarios/entregas-de-epis/:id (DELETE) - Deve retornar erro ao excluir uma entrega de epi com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/funcionarios/entregas-de-epis/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/entregas-de-epis/:id (DELETE) - Deve retornar erro ao excluir uma entrega de epi inexistente', async () => {
    const response = await request(app.getHttpServer())
      .delete(
        '/v1/funcionarios/entregas-de-epis/86f226c4-38b0-464c-987e-35293033faf6',
      )
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Entrega de Epi(s) já excluída(s) ou não encontrada(s).',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
