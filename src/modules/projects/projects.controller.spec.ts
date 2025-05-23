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
import { ProjectsModule } from './projects.module';
import { UpdateProjectDto } from './dto/update-project.dto';
import { MockUserInterceptor } from '../../common/interceptors/mock-user.interceptor';

describe('ProjetoController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let mockUserInterceptor: MockUserInterceptor;
  let createdUser: User;
  let createdCompany: Company;

  const project = {
    nome: 'Projeto Teste',
    descricao: 'Descrição Teste',
    dataInicio: '2025-01-29',
    cno: '123456734032',
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
        ProjectsModule,
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
      await dataSource.query('DELETE FROM "projetos" CASCADE;');
    }
  });

  it('/v1/empresas/:empresaId/projetos (POST) - Deve cadastrar um projeto', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/projetos`)
      .send(project)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        nome: project.nome,
        descricao: project.descricao,
        cno: project.cno,
      },
      message: expect.stringContaining('Projeto cadastrado com sucesso, id: #'),
    });
  });

  it('/v1/empresas/:empresaId/projetos (POST) - Deve retornar erro ao criar um projeto sem informações obrigatórias', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/projetos`)
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome should not be empty']),
    );
  });

  it('/v1/empresas/:empresaId/projetos (POST) - Deve retornar erro ao criar um projeto com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/projetos`)
      .send({ ...project, nome: 123 })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome must be a string']),
    );
  });

  it('/v1/empresas/:empresaId/projetos (POST) - Deve retornar erro caso o ID da empresa não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/86f226c4-38b0-464c-987e-35293033faf6/projetos`)
      .send({
        ...project,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/projetos (GET) - Deve listar todos os projetos de uma empresa', async () => {
    const projectRepository = dataSource.getRepository(Project);
    await projectRepository.save({
      ...project,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/${createdCompany.id}/projetos`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/empresas/projetos/:id (GET) - Deve retonar um projeto específico', async () => {
    const projectRepository = dataSource.getRepository(Project);
    const createdProject = await projectRepository.save({
      ...project,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/projetos/${createdProject.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdProject.id,
      nome: createdProject.nome,
    });
  });

  it('/v1/empresas/projetos/:id (GET) - Deve retornar erro ao buscar um projeto inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/empresas/projetos/86f226c4-38b0-464c-987e-35293033faf6')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Projeto não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/projetos/:id (GET) - Deve retornar erro ao buscar um projeto com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/empresas/projetos/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/projetos/:id (PATCH) - Deve atualizar os dados de um projeto', async () => {
    const projectRepository = dataSource.getRepository(Project);
    const createdProject = await projectRepository.save({
      ...project,
      empresa: createdCompany,
    });

    const updateData: UpdateProjectDto = {
      nome: 'Projeto Atualizado',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/projetos/${createdProject.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdProject.id,
        nome: updateData.nome,
        atualizadoPor: createdUser.nome,
      },
      message: `Projeto id: #${createdProject.id} atualizado com sucesso.`,
    });
  });

  it('/v1/empresas/projetos/:id (PATCH) - Deve retornar um erro ao atualizar um projeto com tipo de dado inválido', async () => {
    const projectRepository = dataSource.getRepository(Project);
    const createdProject = await projectRepository.save({
      ...project,
      empresa: createdCompany,
    });

    const updateData = {
      nome: 123,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/projetos/${createdProject.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome must be a string']),
    );
  });

  it('/v1/empresas/projetos/:id (PATCH) - Deve retornar erro ao atualizar um projeto com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/projetos/abc')
      .send({
        nome: 'Projeto Atualizado',
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/projetos/:id (PATCH) - Deve retornar erro ao atualizar um projeto inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/projetos/86f226c4-38b0-464c-987e-35293033faf6')
      .send({
        nomeFantasia: 'Projeto Inexistente',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Projeto não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/projetos/:id (DELETE) - Deve excluir um projeto', async () => {
    const projectRepository = dataSource.getRepository(Project);
    const createdProject = await projectRepository.save({
      ...project,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/projetos/${createdProject.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdProject.id,
        nome: createdProject.nome,
        atualizadoPor: createdUser.nome,
        status: 'E',
      },
      message: `Projeto id: #${createdProject.id} excluído com sucesso.`,
    });
  });

  it('/v1/empresas/projetos/:id (DELETE) - Deve retornar erro ao excluir um projeto com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/projetos/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/projetos/:id (DELETE) - Deve retornar erro ao excluir um projeto inexistente', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/projetos/86f226c4-38b0-464c-987e-35293033faf6')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Projeto já excluído ou não encontrado.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
