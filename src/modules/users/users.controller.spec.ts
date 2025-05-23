import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users.module';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { MockAuthGuard } from '../../common/guards/mock-auth.guard';
import { Funcao, User } from './entities/user.entity';
import { Company } from '../companies/entities/company.entity';
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
import { MockUserInterceptor } from '../../common/interceptors/mock-user.interceptor';

describe('UsersController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let mockUserInterceptor: MockUserInterceptor;
  let createdUser: User;
  let createdCompany: Company;

  const initialUser = {
    nome: 'Usuário Teste',
    email: 'teste@example.com',
    senha: '&S$3xb0bOmB',
    funcao: Funcao.ADMIN,
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
        UsersModule,
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
      funcao: Funcao.VISUALIZADOR,
    });
    createdUser = await userRepository.save(user);

    // mockUserInterceptor.setUserId(createdUser.id);

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
      await dataSource.query('DELETE FROM "usuarios" CASCADE;');
    }
  });

  it('/v1/usuarios (GET) - Deve listar todos os usuários', async () => {
    const userRepository = dataSource.getRepository(User);
    await userRepository.save(initialUser);

    const response = await request(app.getHttpServer())
      .get('/v1/usuarios')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/usuarios (GET) - Deve listar todos os usuários de uma empresa', async () => {
    const userRepository = dataSource.getRepository(User);
    await userRepository.save({
      ...initialUser,
      empresa: createdCompany.id,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/usuarios/empresa/${createdCompany.id}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/usuarios (GET) - Deve retornar um erro ao buscar usuários de uma empresa com um ID inexistente', async () => {
    const userRepository = dataSource.getRepository(User);
    await userRepository.save({
      ...initialUser,
      empresa: createdCompany.id,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/usuarios/empresa/86f226c4-38b0-464c-987e-35293033faf6`)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/usuarios (GET) - Deve retornar um erro ao buscar usuários de uma empresa com um ID inválido', async () => {
    const userRepository = dataSource.getRepository(User);
    await userRepository.save({
      ...initialUser,
      empresa: createdCompany.id,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/usuarios/empresa/999`)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/usuarios/:id (GET) - Deve retornar um usuário específico', async () => {
    const userRepository = dataSource.getRepository(User);
    const createdUser1 = await userRepository.save(initialUser);

    const response = await request(app.getHttpServer())
      .get(`/v1/usuarios/${createdUser1.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdUser1.id,
      nome: createdUser1.nome,
      email: createdUser1.email,
      funcao: createdUser1.funcao,
    });
  });

  it('/v1/usuarios/:id (GET) - Deve retornar um erro ao buscar um usuário inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get(`/v1/usuarios/86f226c4-38b0-464c-987e-35293033faf6`)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/usuarios/:id (GET) - Deve retornar um erro ao buscar um usuário com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get(`/v1/usuarios/abc`)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/usuarios/:id (PATCH) - Deve atualizar os dados de um usuário', async () => {
    const userRepository = dataSource.getRepository(User);
    const createdUser2 = await userRepository.save({
      ...initialUser,
      criadoPor: createdUser.id,
    });

    const updateData = {
      nome: 'Novo Nome',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/usuarios/${createdUser2.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdUser2.id,
        nome: updateData.nome,
      },
      message: `Usuário id: #${createdUser2.id} atualizado com sucesso.`,
    });
  });

  it('/v1/usuarios/:id (PATCH) - Deve retornar erro ao atualizar um usuário com um ID inválido', async () => {
    const updateUserDto = {
      nome: 'Novo Nome',
    };

    const response = await request(app.getHttpServer())
      .patch('/v1/usuarios/abc')
      .send(updateUserDto)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/usuarios/:id (PATCH) - Deve retornar erro ao atualizar um usuário com um ID inexistente', async () => {
    const updateUserDto = {
      nome: 'Novo Nome',
    };

    const response = await request(app.getHttpServer())
      .patch('/v1/usuarios/86f226c4-38b0-464c-987e-35293033faf6')
      .send(updateUserDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/usuarios/:id (DELETE) - Deve excluir um usuário', async () => {
    const userRepository = dataSource.getRepository(User);
    const createdUser3 = await userRepository.save(initialUser);

    const response = await request(app.getHttpServer())
      .delete(`/v1/usuarios/${createdUser3.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdUser3.id,
        status: 'E',
      },
      message: `Usuário id: #${createdUser3.id} excluído com sucesso.`,
    });
  });

  it('/v1/usuarios/:id (DELETE) - Deve retornar erro ao excluir um usuário com um ID inválido', async () => {
    const userRepository = dataSource.getRepository(User);
    await userRepository.save(initialUser);

    const response = await request(app.getHttpServer())
      .delete(`/v1/usuarios/abc`)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/usuarios/:id (DELETE) - Deve retornar erro ao excluir um usuário inexistente', async () => {
    const userRepository = dataSource.getRepository(User);
    await userRepository.save(initialUser);

    const response = await request(app.getHttpServer())
      .delete(`/v1/usuarios/86f226c4-38b0-464c-987e-35293033faf6`)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
