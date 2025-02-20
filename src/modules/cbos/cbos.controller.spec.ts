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
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';
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
import { User } from '../users/entities/user.entity';
import { CbosModule } from './cbos.module';
import { UpdateCboDto } from './dto/update-cbo.dto';

describe('CboController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let createdUser: User;
  let createdCompany: Company;
  const cbo = {
    nome: 'Desenvolvedor de Sistemas Web',
    criadoPor: 1,
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
    await app.init();

    dataSource = app.get(DataSource);

    const userRepository = dataSource.getRepository(User);
    const companyRepository = dataSource.getRepository(Company);

    const user = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste1@example.com',
      senha: 'senha123',
      funcao: 'teste',
    });
    createdUser = await userRepository.save(user);

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
      telefone: '(11) 99999-9999',
      faturamento: 1200000.5,
      regimeTributario: 'Simples Nacional',
      inscricaoEstadual: '1234567890',
      cnaePrincipal: '6201500',
      segmento: 'Tecnologia',
      ramoAtuacao: 'Desenvolvimento de Software',
      logoUrl: 'https://example.com/logo.png',
      status: 'A',
      criadoPor: createdUser,
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
    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: `Cbo cadastrado com sucesso, id: #1.`,
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
      expect.arrayContaining([
        'nome should not be empty',
        'criadoPor should not be empty',
      ]),
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
      .post(`/v1/empresas/999/cbos`)
      .send({
        ...cbo,
        criadoPor: createdUser.id,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/cbos (POST) - Deve retornar erro caso o ID do responsável pela criação não seja um número', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/cbos`)
      .send({
        ...cbo,
        criadoPor: 'Teste',
      })
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'criadoPor must be a number conforming to the specified constraints',
      ]),
    );
  });

  it('/v1/empresas/:empresaId/cbos (POST) - Deve retornar erro caso o ID do responsável pela criação não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/cbos`)
      .send({
        ...cbo,
        criadoPor: 999,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/cbos (GET) - Deve listar todos os cbos de uma empresa', async () => {
    const cboRepository = dataSource.getRepository(Cbo);
    await cboRepository.save({
      ...cbo,
      empresa: createdCompany,
      criadoPor: createdUser,
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
      criadoPor: createdUser,
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
      .get('/v1/empresas/cbos/999')
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
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/cbos/:id (PATCH) - Deve atualizar os dados de um cbo', async () => {
    const cboRepository = dataSource.getRepository(Cbo);
    const createdCbo = await cboRepository.save({
      ...cbo,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData: UpdateCboDto = {
      nome: 'Desenvolvedor de Sistemas',
      atualizadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/cbos/${createdCbo.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: expect.any(Number),
        nome: 'Desenvolvedor de Sistemas',
        atualizadoPor: expect.any(String),
      },
      message: `Cbo id: #${createdCbo.id} atualizado com sucesso.`,
    });

    const updatedcbo = await cboRepository.findOneBy({
      id: createdCbo.id,
    });

    expect(updatedcbo.nome).toBe(updateData.nome);
  });

  it('/v1/empresas/cbos/:id (PATCH) - Deve retornar um erro ao atualizar um cbo com tipo de dado inválido', async () => {
    const cboRepository = dataSource.getRepository(Cbo);
    const createdCbo = await cboRepository.save({
      ...cbo,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 123,
      atualizadoPor: createdUser.id,
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

  it('/v1/empresas/cbos/:id (PATCH) - Deve retornar erro ao não informar o ID do responsável pela atualização', async () => {
    const cboRepository = dataSource.getRepository(Cbo);
    const createdCbo = await cboRepository.save({
      ...cbo,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 'Desenvolvedor de Sistemas',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/cbos/${createdCbo.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O usuário responsável pela atualização deve ser informado.',
      ]),
    );
  });

  it('/v1/empresas/cbos/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não seja um número', async () => {
    const cboRepository = dataSource.getRepository(Cbo);
    const createdCbo = await cboRepository.save({
      ...cbo,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 'Desenvolvedor de Sistemas',
      atualizadoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/cbos/${createdCbo.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O identificador do usuário deve ser um número.',
      ]),
    );
  });

  it('/v1/empresas/cbos/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não exista', async () => {
    const cboRepository = dataSource.getRepository(Cbo);
    const createdCbo = await cboRepository.save({
      ...cbo,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 'Desenvolvedor de Sistemas',
      atualizadoPor: 999,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/cbos/${createdCbo.id}`)
      .send(updateData)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/cbos/:id (PATCH) - Deve retornar erro ao atualizar um cbo com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/cbos/abc')
      .send({
        nome: 'Desenvolvedor de Sistemas',
        atualizadoPor: 1,
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/cbos/:id (PATCH) - Deve retornar erro ao atualizar um cbo inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/cbos/9999')
      .send({
        nomeFantasia: 'Cbo Inexistente',
        atualizadoPor: 1,
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
      criadoPor: createdUser,
    });

    const delelecboDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/cbos/${createdCbo.id}`)
      .send(delelecboDto)
      .expect(200);

    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: `Cbo id: #${createdCbo.id} excluído com sucesso.`,
    });

    const deletedcbo = await cboRepository.findOneBy({
      id: createdCbo.id,
    });

    expect(deletedcbo.status).toBe('E');
  });

  it('/v1/empresas/cbos/:id (DELETE) - Deve retornar erro ao não informar o ID do responsável pela exclusão', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/cbos/1`)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O usuário responsável pela exclusão deve ser informado.',
      ]),
    );
  });

  it('/v1/empresas/cbos/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não seja um número', async () => {
    const delelecboDto = {
      excluidoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/cbos/1`)
      .send(delelecboDto)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O identificador do usuário deve ser um número.',
      ]),
    );
  });

  it('/v1/empresas/cbos/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não exista', async () => {
    const delelecboDto: BaseDeleteDto = {
      excluidoPor: 999,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/cbos/${createdCompany.id}`)
      .send(delelecboDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/cbos/:id (DELETE) - Deve retornar erro ao excluir um cbo com um ID inválido', async () => {
    const delelecboDto: BaseDeleteDto = {
      excluidoPor: 1,
    };

    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/cbos/abc')
      .send(delelecboDto)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/cbos/:id (DELETE) - Deve retornar erro ao excluir um cbo inexistente', async () => {
    const delelecboDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/cbos/9999')
      .send(delelecboDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Cbo não encontrado.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
