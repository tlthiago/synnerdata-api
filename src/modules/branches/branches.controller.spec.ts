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
import { BranchesModule } from './branches.module';
import { MockUserInterceptor } from '../../common/interceptors/mock-user.interceptor';
import { UpdateBranchDto } from './dto/update-branch.dto';

describe('BranchesController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let mockUserInterceptor: MockUserInterceptor;
  let createdUser: User;
  let createdCompany: Company;

  const branch = {
    nome: 'Tech Solutions Filial 1',
    cnpj: '12345678004176',
    rua: 'Rua da Tecnologia',
    numero: '123',
    complemento: 'Sala 46',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01000-000',
    dataFundacao: '2010-05-15',
    celular: '+5531991897926',
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
        BranchesModule,
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
      await dataSource.query('DELETE FROM "filiais" CASCADE;');
    }
  });

  it('/v1/empresas/:empresaId/filiais (POST) - Deve cadastrar uma filial', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/filiais`)
      .send(branch)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        nome: branch.nome,
        cnpj: branch.cnpj,
        criadoPor: createdUser.nome,
      },
      message: expect.stringContaining('Filial cadastrada com sucesso, id: #'),
    });
  });

  it('/v1/empresas/:empresaId/filiais (POST) - Deve retornar erro ao criar uma filial sem informações obrigatórias', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/filiais`)
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome should not be empty']),
    );
  });

  it('/v1/empresas/:empresaId/filiais (POST) - Deve retornar erro ao criar uma filial com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/filiais`)
      .send({ ...branch, cnpj: 12345678004176 })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['cnpj must be a string']),
    );
  });

  it('/v1/empresas/:empresaId/filiais (POST) - Deve retornar erro caso o ID da empresa não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/86f226c4-38b0-464c-987e-35293033faf6/filiais`)
      .send(branch)
      .expect(404);

    expect(response.body).toEqual({
      message: 'Empresa não encontrada.',
      error: 'Not Found',
      statusCode: 404,
    });
  });

  it('/v1/empresas/:empresaId/filiais (POST) - Deve retornar erro caso o ID da empresa não seja um UUID', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/999/filiais`)
      .send(branch)
      .expect(400);

    expect(response.body).toEqual({
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('/v1/empresas/:empresaId/filiais (POST) - Deve retornar erro ao criar uma filial com CNPJ já cadastrado em uma empresa', async () => {
    const branchesRepository = dataSource.getRepository(Branch);
    await branchesRepository.save({
      ...branch,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/filiais`)
      .send({ ...branch, cnpj: createdCompany.cnpj })
      .expect(409);

    expect(response.body.message).toContain(
      'Já existe uma organização com o mesmo CNPJ.',
    );
  });

  it('/v1/empresas/:empresaId/filiais (POST) - Deve retornar erro ao criar uma filial com CNPJ já cadastrado em uma filial', async () => {
    const branchesRepository = dataSource.getRepository(Branch);
    await branchesRepository.save({
      ...branch,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/filiais`)
      .send(branch)
      .expect(409);

    expect(response.body.message).toContain(
      'Já existe uma organização com o mesmo CNPJ.',
    );
  });

  it('/v1/empresas/:empresaId/filiais (GET) - Deve listar todas as filiais de uma empresa', async () => {
    const branchesRepository = dataSource.getRepository(Branch);
    await branchesRepository.save({
      ...branch,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/${createdCompany.id}/filiais`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/empresas/filiais/:id (GET) - Deve retonar uma filial específica', async () => {
    const branchesRepository = dataSource.getRepository(Branch);
    const createdBranch = await branchesRepository.save({
      ...branch,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/filiais/${createdBranch.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdBranch.id,
      nome: createdBranch.nome,
    });
  });

  it('/v1/empresas/filiais/:id (GET) - Deve retornar erro ao buscar uma filial inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/empresas/filiais/86f226c4-38b0-464c-987e-35293033faf6')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Filial não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/filiais/:id (GET) - Deve retornar caso o ID da filial não seja um UUID', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/empresas/filiais/abc')
      .expect(400);

    expect(response.body).toEqual({
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('/v1/empresas/filiais/:id (PATCH) - Deve atualizar os dados de uma filial', async () => {
    const branchesRepository = dataSource.getRepository(Branch);
    const createdBranch = await branchesRepository.save({
      ...branch,
      empresa: createdCompany,
    });

    const updateData: UpdateBranchDto = {
      nome: 'Tech Solutions Filial Updated',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/filiais/${createdBranch.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdBranch.id,
        nome: updateData.nome,
        atualizadoPor: createdUser.nome,
      },
      message: `Filial id: #${createdBranch.id} atualizada com sucesso.`,
    });
  });

  it('/v1/empresas/filiais/:id (PATCH) - Deve retornar erro ao atualizar uma filial com tipo de dado inválido', async () => {
    const branchesRepository = dataSource.getRepository(Branch);
    const createdBranch = await branchesRepository.save({
      ...branch,
      empresa: createdCompany,
    });

    const updateData = {
      nome: 123,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/filiais/${createdBranch.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome must be a string']),
    );
  });

  it('/v1/empresas/filiais/:id (PATCH) - Deve retornar erro ao atualizar uma filial com um CNPJ já cadastrado em uma empresa', async () => {
    const branchesRepository = dataSource.getRepository(Branch);
    const createdBranch = await branchesRepository.save({
      ...branch,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/filiais/${createdBranch.id}`)
      .send({
        ...branch,
        cnpj: createdCompany.cnpj,
      })
      .expect(409);

    expect(response.body).toEqual({
      statusCode: 409,
      message: 'Já existe uma organização com o mesmo CNPJ.',
      error: 'Conflict',
    });
  });

  it('/v1/empresas/filiais/:id (PATCH) - Deve retornar erro ao atualizar uma filial com um CNPJ já cadastrado em uma filial', async () => {
    const branchesRepository = dataSource.getRepository(Branch);
    const createdBranch = await branchesRepository.save({
      ...branch,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/filiais/${createdBranch.id}`)
      .send({
        ...branch,
      })
      .expect(409);

    expect(response.body).toEqual({
      statusCode: 409,
      message: 'Já existe uma organização com o mesmo CNPJ.',
      error: 'Conflict',
    });
  });

  it('/v1/empresas/filiais/:id (PATCH) - Deve retornar erro ao atualizar uma filial com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/filiais/abc')
      .send({
        nome: 'Nova Tech Solutions',
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/filiais/:id (PATCH) - Deve retornar erro ao atualizar uma filial inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/filiais/86f226c4-38b0-464c-987e-35293033faf6')
      .send({
        nomeFantasia: 'Empresa Inexistente',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Filial não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/filiais/:id (DELETE) - Deve excluir uma filial', async () => {
    const branchesRepository = dataSource.getRepository(Branch);
    const createdBranch = await branchesRepository.save({
      ...branch,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/filiais/${createdBranch.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdBranch.id,
        nome: createdBranch.nome,
        atualizadoPor: createdUser.nome,
        status: 'E',
      },
      message: `Filial id: #${createdBranch.id} excluída com sucesso.`,
    });
  });

  it('/v1/empresas/filiais/:id (DELETE) - Deve retornar erro ao excluir um filial com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/filiais/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/filiais/:id (DELETE) - Deve retornar erro ao excluir uma filial inexistente', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/filiais/86f226c4-38b0-464c-987e-35293033faf6')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Filial já excluída ou não encontrado.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
