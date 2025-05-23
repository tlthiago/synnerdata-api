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
import { DepartmentsModule } from './departments.module';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { MockUserInterceptor } from '../../common/interceptors/mock-user.interceptor';

describe('DepartmentsController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let mockUserInterceptor: MockUserInterceptor;
  let createdUser: User;
  let createdCompany: Company;

  const department = {
    nome: 'Tecnologia da Informação',
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
        DepartmentsModule,
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
      await dataSource.query('DELETE FROM "setores" CASCADE;');
    }
  });

  it('/v1/empresas/:empresaId/setores (POST) - Deve cadastrar um setor', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/setores`)
      .send(department)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        nome: department.nome,
      },
      message: expect.stringContaining('Setor cadastrado com sucesso, id: #'),
    });
  });

  it('/v1/empresas/:empresaId/setores (POST) - Deve retornar erro ao criar um setor sem informações obrigatórias', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/setores`)
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome should not be empty']),
    );
  });

  it('/v1/empresas/:empresaId/setores (POST) - Deve retornar erro ao criar um setor com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/setores`)
      .send({ ...department, nome: 123 })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome must be a string']),
    );
  });

  it('/v1/empresas/:empresaId/setores (POST) - Deve retornar erro caso o ID da empresa não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/86f226c4-38b0-464c-987e-35293033faf6/setores`)
      .send({
        ...department,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/setores (GET) - Deve listar todos os setores de uma empresa', async () => {
    const departmentsRepository = dataSource.getRepository(Department);
    await departmentsRepository.save({
      ...department,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/${createdCompany.id}/setores`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/empresas/setores/:id (GET) - Deve retonar um setor específico', async () => {
    const departmentsRepository = dataSource.getRepository(Department);
    const createdDepartment = await departmentsRepository.save({
      ...department,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/setores/${createdDepartment.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdDepartment.id,
      nome: createdDepartment.nome,
    });
  });

  it('/v1/empresas/setores/:id (GET) - Deve retornar erro ao buscar uma setor inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/empresas/setores/86f226c4-38b0-464c-987e-35293033faf6')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Setor não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/setores/:id (GET) - Deve retornar erro ao buscar um setor com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/empresas/setores/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/setores/:id (PATCH) - Deve atualizar os dados de um setor', async () => {
    const departmentsRepository = dataSource.getRepository(Department);
    const createdDepartment = await departmentsRepository.save({
      ...department,
      empresa: createdCompany,
    });

    const updateData: UpdateDepartmentDto = {
      nome: 'Recursos Humanos',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/setores/${createdDepartment.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdDepartment.id,
        nome: updateData.nome,
        atualizadoPor: createdUser.nome,
      },
      message: `Setor id: #${createdDepartment.id} atualizado com sucesso.`,
    });
  });

  it('/v1/empresas/setores/:id (PATCH) - Deve retornar um erro ao atualizar um setor com tipo de dado inválido', async () => {
    const departmentsRepository = dataSource.getRepository(Department);
    const createdDepartment = await departmentsRepository.save({
      ...department,
      empresa: createdCompany,
    });

    const updateData = {
      nome: 123,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/setores/${createdDepartment.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome must be a string']),
    );
  });

  it('/v1/empresas/setores/:id (PATCH) - Deve retornar erro ao atualizar uma setor com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/setores/abc')
      .send({
        nome: 'Recursos Humanos',
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/setores/:id (PATCH) - Deve retornar erro ao atualizar um setor inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/setores/86f226c4-38b0-464c-987e-35293033faf6')
      .send({
        nomeFantasia: 'Setor Inexistente',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Setor não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/setores/:id (DELETE) - Deve excluir um setor', async () => {
    const departmentsRepository = dataSource.getRepository(Department);
    const createdDepartment = await departmentsRepository.save({
      ...department,
      empresa: createdCompany,
    });

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/setores/${createdDepartment.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdDepartment.id,
        nome: createdDepartment.nome,
        atualizadoPor: createdUser.nome,
        status: 'E',
      },
      message: `Setor id: #${createdDepartment.id} excluído com sucesso.`,
    });
  });

  it('/v1/empresas/setores/:id (DELETE) - Deve retornar erro ao excluir um setor com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/setores/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/setores/:id (DELETE) - Deve retornar erro ao excluir um setor inexistente', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/setores/86f226c4-38b0-464c-987e-35293033faf6')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Setor já excluído ou não encontrado.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
