import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CompaniesModule } from './companies.module';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { MockAuthGuard } from '../../common/guards/mock-auth.guard';
import { Company } from './entities/company.entity';
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
import { User, Funcao } from '../users/entities/user.entity';

describe('CompaniesController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;

  const company = {
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
    faturamento: 1200000.5,
    regimeTributario: 'Simples Nacional',
    inscricaoEstadual: '1234567890',
    cnaePrincipal: '6201500',
    segmento: 'Tecnologia',
    ramoAtuacao: 'Desenvolvimento de Software',
  };

  const partialCompany = {
    razaoSocial: 'Tech Solutions LTDA',
    nomeFantasia: 'Tech Solutions',
    cnpj: '12345678004175',
    email: 'contato@techsolutions.com.br',
    celular: '+5531991897926',
    rua: 'Rua da Tecnologia',
    numero: '123',
    complemento: 'Sala 45',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01000-000',
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
            User,
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
        CompaniesModule,
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
  }, 50000);

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.query('DELETE FROM "empresas" CASCADE;');
    }
  });

  it('/v1/empresas (POST) - Deve cadastrar uma empresa', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/empresas')
      .send(company)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        nomeFantasia: company.nomeFantasia,
      },
      message: expect.stringContaining('Empresa cadastrada com sucesso, id: #'),
    });
  });

  it('/v1/empresas (POST) - Deve retornar erro ao criar uma empresa sem informações obrigatórias', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/empresas')
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nomeFantasia should not be empty']),
    );
  });

  it('/v1/empresas (POST) - Deve retornar erro ao criar uma empresa com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/empresas')
      .send({
        ...company,
        nomeFantasia: 123,
      })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nomeFantasia must be a string']),
    );
  });

  it('/v1/empresas (POST) - Deve retornar erro ao criar uma empresa com CNPJ já cadastrado', async () => {
    const companyRepository = dataSource.getRepository(Company);

    const existingCompany = companyRepository.create(company);
    await companyRepository.save(existingCompany);

    const response = await request(app.getHttpServer())
      .post('/v1/empresas')
      .send(company)
      .expect(409);

    expect(response.body.message).toContain(
      'Já existe uma empresa com o mesmo CNPJ.',
    );
  });

  it('/v1/empresas (GET) - Deve listar todas as empresas', async () => {
    const companyRepository = dataSource.getRepository(Company);

    const createdCompany = companyRepository.create(company);
    await companyRepository.save(createdCompany);

    const response = await request(app.getHttpServer())
      .get('/v1/empresas')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/empresas/estatisticas (GET) - Deve listar todas as empresas com estatísticas', async () => {
    const companyRepository = dataSource.getRepository(Company);
    const userRepository = dataSource.getRepository(User);

    const createdCompany = companyRepository.create(company);
    await companyRepository.save(createdCompany);

    const user1 = userRepository.create({
      nome: 'Usuário 1',
      email: 'usuario1@empresa.com',
      funcao: Funcao.ADMIN,
      empresa: createdCompany.id,
    });
    const user2 = userRepository.create({
      nome: 'Usuário 2',
      email: 'usuario2@empresa.com',
      funcao: Funcao.VISUALIZADOR,
      empresa: createdCompany.id,
    });
    await userRepository.save([user1, user2]);

    const response = await request(app.getHttpServer())
      .get('/v1/empresas/estatisticas')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('quantidadeUsuarios');
    expect(response.body[0]).toHaveProperty('quantidadeFuncionarios');
    expect(response.body[0]).toHaveProperty('statusAssinatura');
    expect(response.body[0].quantidadeUsuarios).toBe(2);
    expect(response.body[0].quantidadeFuncionarios).toBe(0);
    expect(response.body[0].statusAssinatura).toBe('Inativo');
  });

  it('/v1/empresas/:id (GET) - Deve retonar uma empresa específica', async () => {
    const companyRepository = dataSource.getRepository(Company);

    const createdCompany = companyRepository.create(company);
    await companyRepository.save(createdCompany);

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/${createdCompany.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdCompany.id,
      faturamento: createdCompany.faturamento.toFixed(2),
    });
  });

  it('/v1/empresas/:id (GET) - Deve retornar erro ao buscar uma empresa inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/empresas/86f226c4-38b0-464c-987e-35293033faf6')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:id (GET) - Deve retornar erro ao buscar um empresa com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/empresas/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/:id (PATCH) - Deve atualizar os dados de uma empresa', async () => {
    const companyRepository = dataSource.getRepository(Company);

    const createdCompany = companyRepository.create(company);
    await companyRepository.save(createdCompany);

    const updateData = {
      nomeFantasia: 'Tech Solutions Updated',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/${createdCompany.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdCompany.id,
        nomeFantasia: updateData.nomeFantasia,
      },
      message: `Empresa id: #${createdCompany.id} atualizada com sucesso.`,
    });
  });

  it('/v1/empresas/:id (PATCH) - Deve retornar erro ao atualizar uma empresa com um CNPJ já cadastrado', async () => {
    const companyRepository = dataSource.getRepository(Company);

    const company1 = companyRepository.create(company);
    await companyRepository.save(company1);

    const company2 = companyRepository.create({
      ...company,
      cnpj: '12345678004176',
    });
    await companyRepository.save(company2);

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/${company2.id}`)
      .send({
        cnpj: company1.cnpj,
      })
      .expect(409);

    expect(response.body).toEqual({
      statusCode: 409,
      message: 'Já existe uma empresa com o mesmo CNPJ.',
      error: 'Conflict',
    });
  });

  it('/v1/empresas/:id (PATCH) - Deve retornar erro ao atualizar uma empresa com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/abc')
      .send({
        nomeFantasia: 'Nova Tech Solutions',
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/:id (PATCH) - Deve retornar erro ao atualizar uma empresa inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/86f226c4-38b0-464c-987e-35293033faf6')
      .send({
        nomeFantasia: 'Empresa Inexistente',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:id/finalizar-cadastro (PATCH) - Deve completar o cadastro de uma organização', async () => {
    const companyRepository = dataSource.getRepository(Company);
    const createdCompany = companyRepository.create(partialCompany);
    await companyRepository.save(createdCompany);

    const updateData = {
      dataFundacao: '2010-05-15',
      faturamento: 1200000.5,
      regimeTributario: 'Simples Nacional',
      inscricaoEstadual: '1234567890',
      cnaePrincipal: '6201500',
      segmento: 'Tecnologia',
      ramoAtuacao: 'Desenvolvimento de Software',
      rua: 'Rua da Tecnologia',
      numero: '123',
      complemento: 'Sala 45',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01000-000',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/${createdCompany.id}/finalizar-cadastro`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdCompany.id,
        regimeTributario: updateData.regimeTributario,
        status: 'A',
      },
      message: `Cadastro da empresa, id: #${createdCompany.id} completado com sucesso.`,
    });
  });

  it('/v1/empresas/:id/finalizar-cadastro (PATCH) - Deve retornar erro ao finalizar o cadastro de uma empresa com um ID inválido', async () => {
    const updateData = {
      dataFundacao: '2010-05-15',
      faturamento: 1200000.5,
      regimeTributario: 'Simples Nacional',
      inscricaoEstadual: '1234567890',
      cnaePrincipal: '6201500',
      segmento: 'Tecnologia',
      ramoAtuacao: 'Desenvolvimento de Software',
      rua: 'Rua da Tecnologia',
      numero: '123',
      complemento: 'Sala 45',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01000-000',
    };

    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/abc/finalizar-cadastro')
      .send(updateData)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/:id/finalizar-cadastro (PATCH) - Deve retornar erro ao finalizar o cadastro de uma empresa inexistente', async () => {
    const updateData = {
      dataFundacao: '2010-05-15',
      faturamento: 1200000.5,
      regimeTributario: 'Simples Nacional',
      inscricaoEstadual: '1234567890',
      cnaePrincipal: '6201500',
      segmento: 'Tecnologia',
      ramoAtuacao: 'Desenvolvimento de Software',
      rua: 'Rua da Tecnologia',
      numero: '123',
      complemento: 'Sala 45',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01000-000',
    };

    const response = await request(app.getHttpServer())
      .patch(
        '/v1/empresas/86f226c4-38b0-464c-987e-35293033faf6/finalizar-cadastro',
      )
      .send(updateData)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:id/finalizar-cadastro (POST) - Deve retornar erro ao finalizaro cadastro de uma empresa sem informações obrigatórias', async () => {
    const companyRepository = dataSource.getRepository(Company);
    const createdCompany = companyRepository.create(partialCompany);
    await companyRepository.save(createdCompany);

    const updateData = {
      dataFundacao: '2010-05-15',
      faturamento: 1200000.5,
      regimeTributario: 'Simples Nacional',
      inscricaoEstadual: '1234567890',
      segmento: 'Tecnologia',
      ramoAtuacao: 'Desenvolvimento de Software',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/${createdCompany.id}/finalizar-cadastro`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining(['cnaePrincipal should not be empty']),
    );
  });

  it('/v1/empresas/:id (DELETE) - Deve excluir uma empresa', async () => {
    const companyRepository = dataSource.getRepository(Company);
    const createdCompany = companyRepository.create(company);
    await companyRepository.save(createdCompany);

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/${createdCompany.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdCompany.id,
        nomeFantasia: createdCompany.nomeFantasia,
        status: 'E',
      },
      message: `Empresa id: #${createdCompany.id} excluída com sucesso.`,
    });
  });

  it('/v1/empresas/:id (DELETE) - Deve retornar erro ao excluir um empresa com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/:id (DELETE) - Deve retornar erro ao excluir uma empresa inexistente', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/86f226c4-38b0-464c-987e-35293033faf6')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:id/pburl (PATCH) - Deve atualizar a URL do Power BI com sucesso', async () => {
    const companyRepository = dataSource.getRepository(Company);
    const createdCompany = companyRepository.create(company);
    await companyRepository.save(createdCompany);

    const updateData = {
      pbUrl: 'https://app.powerbi.com/view?r=eyJrIjo',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/${createdCompany.id}/pburl`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdCompany.id,
        pbUrl: updateData.pbUrl,
      },
      message: 'URL do Power BI cadastrada com sucesso.',
    });
  });

  it('/v1/empresas/:id/pburl (PATCH) - Deve retornar 400 ao tentar atualizar com URL inválida', async () => {
    const companyRepository = dataSource.getRepository(Company);
    const createdCompany = companyRepository.create(company);
    await companyRepository.save(createdCompany);

    const invalidData = { pbUrl: 'url-invalida' };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/${createdCompany.id}/pburl`)
      .send(invalidData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.stringContaining('A URL informada não é válida'),
      ]),
    );
  });

  it('/v1/empresas/:id/pburl (PATCH) - Deve retornar 404 ao tentar atualizar empresa inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/f6cfa360-1111-2222-3333-123456789abc/pburl`)
      .send({
        pbUrl: 'https://app.powerbi.com/view?r=valid',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:id/pburl (GET) - Deve retornar a URL do Power BI para empresa existente', async () => {
    const companyRepository = dataSource.getRepository(Company);
    const createdCompany = companyRepository.create({
      ...company,
      pbUrl: 'https://app.powerbi.com/view?r=valid',
    });
    await companyRepository.save(createdCompany);

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/${createdCompany.id}/pburl`)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: createdCompany.pbUrl,
      message: 'URL do Power BI encontrada com sucesso.',
    });
  });

  it('/v1/empresas/:id/pburl (GET) - Deve retornar 404 para empresa inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/e3b0c442-0000-0000-0000-000000000000/pburl`)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
