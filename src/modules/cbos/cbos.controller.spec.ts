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
import { Epi } from '../epis/entities/epi.entity';
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
import { CbosModule } from './cbos.module';
import { UpdateCboDto } from './dto/update-cbo.dto';
import { MockUserInterceptor } from '../../common/interceptors/mock-user.interceptor';

describe('CboController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let mockUserInterceptor: MockUserInterceptor;
  let createdUser: User;
  let createdCompany: Company;

  const cbo = {
    nome: 'Desenvolvedor de Sistemas Web',
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
        CbosModule,
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
  }, 50000);

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.query('DELETE FROM "cbos" CASCADE;');
    }
  });

  it('/v1/empresas/:empresaId/cbos (POST) - Deve cadastrar um cbo', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/cbos`)
      .send(cbo)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        nome: cbo.nome,
      },
      message: expect.stringContaining('Cbo cadastrado com sucesso, id: #'),
    });
  });

  it('/v1/empresas/:empresaId/cbos (POST) - Deve retornar erro ao criar um cbo sem informações obrigatórias', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/cbos`)
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome should not be empty']),
    );
  });

  it('/v1/empresas/:empresaId/cbos (POST) - Deve retornar erro ao criar um cbo com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/cbos`)
      .send({ ...cbo, nome: 123 })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome must be a string']),
    );
  });

  it('/v1/empresas/:empresaId/cbos (POST) - Deve retornar erro caso o ID da empresa não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/86f226c4-38b0-464c-987e-35293033faf6/cbos`)
      .send({
        ...cbo,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/cbos (GET) - Deve listar todos os cbos de uma empresa', async () => {
    const cboRepository = dataSource.getRepository(Cbo);
    await cboRepository.save({
      ...cbo,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/${createdCompany.id}/cbos`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/empresas/cbos/:id (GET) - Deve retonar um cbo específico', async () => {
    const cboRepository = dataSource.getRepository(Cbo);
    const createdCbo = await cboRepository.save({
      ...cbo,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/cbos/${createdCbo.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdCbo.id,
      nome: createdCbo.nome,
    });
  });

  it('/v1/empresas/cbos/:id (GET) - Deve retornar erro ao buscar um cbo inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/empresas/cbos/86f226c4-38b0-464c-987e-35293033faf6')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Cbo não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/cbos/:id (GET) - Deve retornar erro ao buscar um cbo com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/empresas/cbos/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/cbos/:id (PATCH) - Deve atualizar os dados de um cbo', async () => {
    const cboRepository = dataSource.getRepository(Cbo);
    const createdCbo = await cboRepository.save({
      ...cbo,
      empresa: createdCompany,
    });

    const updateData: UpdateCboDto = {
      nome: 'Desenvolvedor de Sistemas',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/cbos/${createdCbo.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdCbo.id,
        nome: updateData.nome,
        atualizadoPor: createdUser.nome,
      },
      message: `Cbo id: #${createdCbo.id} atualizado com sucesso.`,
    });
  });

  it('/v1/empresas/cbos/:id (PATCH) - Deve retornar um erro ao atualizar um cbo com tipo de dado inválido', async () => {
    const cboRepository = dataSource.getRepository(Cbo);
    const createdCbo = await cboRepository.save({
      ...cbo,
      empresa: createdCompany,
    });

    const updateData = {
      nome: 123,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/cbos/${createdCbo.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome must be a string']),
    );
  });

  it('/v1/empresas/cbos/:id (PATCH) - Deve retornar erro ao atualizar um cbo com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/cbos/abc')
      .send({
        nome: 'Desenvolvedor de Sistemas',
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/cbos/:id (PATCH) - Deve retornar erro ao atualizar um cbo inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/cbos/86f226c4-38b0-464c-987e-35293033faf6')
      .send({
        nomeFantasia: 'Cbo Inexistente',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Cbo não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/cbos/:id (DELETE) - Deve excluir um cbo', async () => {
    const cboRepository = dataSource.getRepository(Cbo);
    const createdCbo = await cboRepository.save({
      ...cbo,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/cbos/${createdCbo.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdCbo.id,
        nome: createdCbo.nome,
        atualizadoPor: createdUser.nome,
      },
      message: `Cbo id: #${createdCbo.id} excluído com sucesso.`,
    });
  });

  it('/v1/empresas/cbos/:id (DELETE) - Deve retornar erro ao excluir um cbo com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/cbos/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/cbos/:id (DELETE) - Deve retornar erro ao excluir um cbo inexistente', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/cbos/86f226c4-38b0-464c-987e-35293033faf6')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Cbo já excluído ou não encontrado.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
