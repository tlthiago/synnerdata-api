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
import { DepartmentsModule } from './departments.module';
import { UpdateDepartmentDto } from './dto/update-department.dto';

describe('DepartmentsController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let createdUser: User;
  let createdCompany: Company;
  const department = {
    nome: 'Tecnologia da Informação',
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
      await dataSource.query('DELETE FROM "setores" CASCADE;');
    }
  });

  it('/v1/empresas/:empresaId/setores (POST) - Deve cadastrar um setor', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/setores`)
      .send(department)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: `Setor cadastrado com sucesso, id: #1.`,
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
      expect.arrayContaining([
        'nome should not be empty',
        'criadoPor should not be empty',
      ]),
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
      .post(`/v1/empresas/999/setores`)
      .send({
        ...department,
        criadoPor: createdUser.id,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/setores (POST) - Deve retornar erro caso o ID do responsável pela criação não seja um número', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/setores`)
      .send({
        ...department,
        criadoPor: 'Teste',
      })
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'criadoPor must be a number conforming to the specified constraints',
      ]),
    );
  });

  it('/v1/empresas/:empresaId/setores (POST) - Deve retornar erro caso o ID do responsável pela criação não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/setores`)
      .send({
        ...department,
        criadoPor: 999,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/setores (GET) - Deve listar todos os setores de uma empresa', async () => {
    const departmentsRepository = dataSource.getRepository(Department);
    await departmentsRepository.save({
      ...department,
      empresa: createdCompany,
      criadoPor: createdUser,
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
      criadoPor: createdUser,
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
      .get('/v1/empresas/setores/999')
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
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/setores/:id (PATCH) - Deve atualizar os dados de um setor', async () => {
    const departmentsRepository = dataSource.getRepository(Department);
    const createdDepartment = await departmentsRepository.save({
      ...department,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData: UpdateDepartmentDto = {
      nome: 'Recursos Humanos',
      atualizadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/setores/${createdDepartment.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: expect.any(Number),
        nome: 'Recursos Humanos',
        atualizadoPor: expect.any(String),
      },
      message: `Setor id: #${createdDepartment.id} atualizado com sucesso.`,
    });

    const updatedDepartment = await departmentsRepository.findOneBy({
      id: createdDepartment.id,
    });

    expect(updatedDepartment.nome).toBe(updateData.nome);
  });

  it('/v1/empresas/setores/:id (PATCH) - Deve retornar um erro ao atualizar um setor com tipo de dado inválido', async () => {
    const departmentsRepository = dataSource.getRepository(Department);
    const createdDepartment = await departmentsRepository.save({
      ...department,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 123,
      atualizadoPor: createdUser.id,
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

  it('/v1/empresas/setores/:id (PATCH) - Deve retornar erro ao não informar o ID do responsável pela atualização', async () => {
    const departmentsRepository = dataSource.getRepository(Department);
    const createdDepartment = await departmentsRepository.save({
      ...department,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 'Recursos Humanos',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/setores/${createdDepartment.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O usuário responsável pela atualização deve ser informado.',
      ]),
    );
  });

  it('/v1/empresas/setores/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não seja um número', async () => {
    const departmentsRepository = dataSource.getRepository(Department);
    const createdDepartment = await departmentsRepository.save({
      ...department,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 'Recursos Humanos',
      atualizadoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/setores/${createdDepartment.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O identificador do usuário deve ser um número.',
      ]),
    );
  });

  it('/v1/empresas/setores/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não exista', async () => {
    const departmentsRepository = dataSource.getRepository(Department);
    const createdDepartment = await departmentsRepository.save({
      ...department,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 'Recursos Humanos',
      atualizadoPor: 999,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/setores/${createdDepartment.id}`)
      .send(updateData)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/setores/:id (PATCH) - Deve retornar erro ao atualizar uma setor com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/setores/abc')
      .send({
        nome: 'Recursos Humanos',
        atualizadoPor: 1,
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/setores/:id (PATCH) - Deve retornar erro ao atualizar um setor inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/setores/9999')
      .send({
        nomeFantasia: 'Setor Inexistente',
        atualizadoPor: 1,
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
      criadoPor: createdUser,
    });

    const deleleDepartmentDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/setores/${createdDepartment.id}`)
      .send(deleleDepartmentDto)
      .expect(200);

    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: `Setor id: #${createdDepartment.id} excluído com sucesso.`,
    });

    const deletedDepartment = await departmentsRepository.findOneBy({
      id: createdDepartment.id,
    });

    expect(deletedDepartment.status).toBe('E');
  });

  it('/v1/empresas/setores/:id (DELETE) - Deve retornar erro ao não informar o ID do responsável pela exclusão', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/setores/1`)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O usuário responsável pela exclusão deve ser informado.',
      ]),
    );
  });

  it('/v1/empresas/setores/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não seja um número', async () => {
    const deleleDepartmentDto = {
      excluidoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/setores/1`)
      .send(deleleDepartmentDto)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O identificador do usuário deve ser um número.',
      ]),
    );
  });

  it('/v1/empresas/setores/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não exista', async () => {
    const deleleDepartmentDto: BaseDeleteDto = {
      excluidoPor: 999,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/setores/${createdCompany.id}`)
      .send(deleleDepartmentDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/setores/:id (DELETE) - Deve retornar erro ao excluir um setor com um ID inválido', async () => {
    const deleleDepartmentDto: BaseDeleteDto = {
      excluidoPor: 1,
    };

    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/setores/abc')
      .send(deleleDepartmentDto)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/setores/:id (DELETE) - Deve retornar erro ao excluir um setor inexistente', async () => {
    const deleleDepartmentDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/setores/9999')
      .send(deleleDepartmentDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Setor não encontrado.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
