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
import { CostCentersModule } from './cost-centers.module';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';
import { MockUserInterceptor } from '../../common/interceptors/mock-user.interceptor';

describe('CostCenterController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let mockUserInterceptor: MockUserInterceptor;
  let createdUser: User;
  let createdCompany: Company;

  const costCenter = {
    nome: 'TI - Sistemas',
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
        CostCentersModule,
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
      await dataSource.query('DELETE FROM "centros_de_custo" CASCADE;');
    }
  });

  it('/v1/empresas/:empresaId/centros-de-custo (POST) - Deve cadastrar um centro de custo', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/centros-de-custo`)
      .send(costCenter)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        nome: costCenter.nome,
      },
      message: expect.stringContaining(
        'Centro de custo cadastrado com sucesso, id: #',
      ),
    });
  });

  it('/v1/empresas/:empresaId/centros-de-custo (POST) - Deve retornar erro ao criar um centro de custo sem informações obrigatórias', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/centros-de-custo`)
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome should not be empty']),
    );
  });

  it('/v1/empresas/:empresaId/centros-de-custo (POST) - Deve retornar erro ao criar um centro de custo com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/centros-de-custo`)
      .send({ ...costCenter, nome: 123 })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome must be a string']),
    );
  });

  it('/v1/empresas/:empresaId/centros-de-custo (POST) - Deve retornar erro caso o ID da empresa não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(
        `/v1/empresas/86f226c4-38b0-464c-987e-35293033faf6/centros-de-custo`,
      )
      .send({
        ...costCenter,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/centros-de-custo (GET) - Deve listar todos os centros de custo de uma empresa', async () => {
    const costCenterRepository = dataSource.getRepository(CostCenter);
    await costCenterRepository.save({
      ...costCenter,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/${createdCompany.id}/centros-de-custo`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/empresas/centros-de-custo/:id (GET) - Deve retonar um centro de custo específico', async () => {
    const costCenterRepository = dataSource.getRepository(CostCenter);
    const createdCostCenter = await costCenterRepository.save({
      ...costCenter,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/centros-de-custo/${createdCostCenter.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdCostCenter.id,
      nome: createdCostCenter.nome,
    });
  });

  it('/v1/empresas/centros-de-custo/:id (GET) - Deve retornar erro ao buscar uma centro de custo inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/empresas/centros-de-custo/86f226c4-38b0-464c-987e-35293033faf6')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Centro de custo não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/centros-de-custo/:id (GET) - Deve retornar erro ao buscar um centro de custo com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/empresas/centros-de-custo/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/centros-de-custo/:id (PATCH) - Deve atualizar os dados de um centro de custo', async () => {
    const costCenterRepository = dataSource.getRepository(CostCenter);
    const createdCostCenter = await costCenterRepository.save({
      ...costCenter,
      empresa: createdCompany,
    });

    const updateData: UpdateCostCenterDto = {
      nome: 'TI - Infraestrutura',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/centros-de-custo/${createdCostCenter.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdCostCenter.id,
        nome: updateData.nome,
        atualizadoPor: createdUser.nome,
      },
      message: `Centro de custo id: #${createdCostCenter.id} atualizado com sucesso.`,
    });
  });

  it('/v1/empresas/centros-de-custo/:id (PATCH) - Deve retornar um erro ao atualizar um centro de custo com tipo de dado inválido', async () => {
    const costCenterRepository = dataSource.getRepository(CostCenter);
    const createdCostCenter = await costCenterRepository.save({
      ...costCenter,
      empresa: createdCompany,
    });

    const updateData = {
      nome: 123,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/centros-de-custo/${createdCostCenter.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome must be a string']),
    );
  });

  it('/v1/empresas/centros-de-custo/:id (PATCH) - Deve retornar erro ao atualizar uma centro de custo com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/centros-de-custo/abc')
      .send({
        nome: 'TI - Infraestrutura',
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/centros-de-custo/:id (PATCH) - Deve retornar erro ao atualizar um centro de custo inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch(
        '/v1/empresas/centros-de-custo/86f226c4-38b0-464c-987e-35293033faf6',
      )
      .send({
        nomeFantasia: 'Centro de Custo Inexistente',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Centro de custo não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/centros-de-custo/:id (DELETE) - Deve excluir um centro de custo', async () => {
    const costCenterRepository = dataSource.getRepository(CostCenter);
    const createdCostCenter = await costCenterRepository.save({
      ...costCenter,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/centros-de-custo/${createdCostCenter.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdCostCenter.id,
        nome: createdCostCenter.nome,
        atualizadoPor: createdUser.nome,
        status: 'E',
      },
      message: `Centro de custo id: #${createdCostCenter.id} excluído com sucesso.`,
    });
  });

  it('/v1/empresas/centros-de-custo/:id (DELETE) - Deve retornar erro ao excluir um centro de custo com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/centros-de-custo/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/centros-de-custo/:id (DELETE) - Deve retornar erro ao excluir um centro de custo inexistente', async () => {
    const response = await request(app.getHttpServer())
      .delete(
        '/v1/empresas/centros-de-custo/86f226c4-38b0-464c-987e-35293033faf6',
      )
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Centro de custo já excluído ou não encontrado.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
