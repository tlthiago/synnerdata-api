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
import { Role } from '../roles/entities/role.entity';
import { RolesModule } from './roles.module';
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
import { User } from '../users/entities/user.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEpiAction, RoleEpiLogs } from './entities/role-epi-logs.entity';

describe('FunçãoController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let createdUser: User;
  let createdCompany: Company;
  let createdEpi: Epi;
  const role = {
    nome: 'Gerente',
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
        RolesModule,
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
    const epiRepository = dataSource.getRepository(Epi);

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

    const epi = epiRepository.create({
      nome: 'Bota',
      descricao: 'Equipamento para pedreiro.',
      equipamentos: 'Exemplo',
      criadoPor: createdUser,
    });
    createdEpi = await epiRepository.save(epi);
  }, 40000);

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.query('DELETE FROM "funcao_epi_logs" CASCADE;');
      await dataSource.query('DELETE FROM "funcoes" CASCADE;');
    }
  });

  it('/v1/empresas/:empresaId/funcoes (POST) - Deve cadastrar uma função', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcoes`)
      .send(role)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: `Função cadastrada com sucesso, id: #1.`,
    });
  });

  it('/v1/empresas/:empresaId/funcoes (POST) - Deve cadastrar uma função com epi(s)', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcoes`)
      .send({ ...role, epis: [createdEpi.id] })
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: `Função cadastrada com sucesso, id: #2.`,
    });

    const roleRepository = dataSource.getRepository(Role);
    const createdRole = await roleRepository.findOne({
      where: { id: 2 },
      relations: ['epis'],
    });

    expect(createdRole).toBeDefined();
    expect(createdRole.epis).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: createdEpi.id })]),
    );
  });

  it('/v1/empresas/:empresaId/funcoes (POST) - Deve retornar erro ao criar uma função sem informações obrigatórias', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcoes`)
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

  it('/v1/empresas/:empresaId/funcoes (POST) - Deve retornar erro ao criar uma função com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcoes`)
      .send({ ...role, nome: 123 })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome must be a string']),
    );
  });

  it('/v1/empresas/:empresaId/funcoes (POST) -  Deve retornar erro ao criar uma função com epi(s) com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcoes`)
      .send({ ...role, epis: createdEpi.id })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['epis must be an array']),
    );
  });

  it('/v1/empresas/:empresaId/funcoes (POST) - Deve retornar erro caso o ID da empresa não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/999/funcoes`)
      .send({
        ...role,
        criadoPor: createdUser.id,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/funcoes (POST) - Deve retornar erro caso o ID do responsável pela criação não seja um número', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcoes`)
      .send({
        ...role,
        criadoPor: 'Teste',
      })
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'criadoPor must be a number conforming to the specified constraints',
      ]),
    );
  });

  it('/v1/empresas/:empresaId/funcoes (POST) - Deve retornar erro caso o ID do responsável pela criação não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcoes`)
      .send({
        ...role,
        criadoPor: 999,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/funcoes (POST) - Deve retornar erro caso o ID dos(s) epi(s) não exista(m)', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/funcoes`)
      .send({
        ...role,
        epis: [999],
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Epi(s) não encontrado(s).',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/funcoes (GET) - Deve listar todas funções de uma empresa', async () => {
    const roleRepository = dataSource.getRepository(Role);
    const createdRole1 = await roleRepository.save({
      ...role,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const createdRole2 = await roleRepository.save({
      ...role,
      nome: 'Assistente',
      epis: [createdEpi],
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/${createdCompany.id}/funcoes`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body).toMatchObject([
      {
        id: createdRole1.id,
        nome: createdRole1.nome,
        epis: [],
      },
      {
        id: createdRole2.id,
        nome: createdRole2.nome,
        epis: [
          {
            id: createdEpi.id,
            nome: createdEpi.nome,
          },
        ],
      },
    ]);
  });

  it('/v1/empresas/funcoes/:id (GET) - Deve retonar uma função específica sem epi(s)', async () => {
    const roleRepository = dataSource.getRepository(Role);
    const createdRole = await roleRepository.save({
      ...role,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/funcoes/${createdRole.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdRole.id,
      nome: createdRole.nome,
    });
  });

  it('/v1/empresas/funcoes/:id (GET) - Deve retonar uma função específica contendo epi(s)', async () => {
    const roleRepository = dataSource.getRepository(Role);
    const createdRole = await roleRepository.save({
      ...role,
      epis: [createdEpi],
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/funcoes/${createdRole.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdRole.id,
      nome: createdRole.nome,
      epis: [
        {
          id: createdEpi.id,
          nome: createdEpi.nome,
        },
      ],
    });
  });

  it('/v1/empresas/funcoes/:id (GET) - Deve retornar erro ao buscar uma função inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/empresas/funcoes/999')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Função não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/funcoes/:id (GET) - Deve retornar erro ao buscar uma função com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/empresas/funcoes/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/funcoes/:id (PATCH) - Deve atualizar os dados de uma função', async () => {
    const roleRepository = dataSource.getRepository(Role);
    const createdRole = await roleRepository.save({
      ...role,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData: UpdateRoleDto = {
      nome: 'Coordenador',
      atualizadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcoes/${createdRole.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: expect.any(Number),
        nome: 'Coordenador',
        atualizadoPor: expect.any(String),
      },
      message: `Função id: #${createdRole.id} atualizada com sucesso.`,
    });
  });

  it('/v1/empresas/funcoes/:id (PATCH) - Deve atualizar os dados de uma função com epi(s)', async () => {
    const roleRepository = dataSource.getRepository(Role);
    const epiRepository = dataSource.getRepository(Epi);
    const createdRole = await roleRepository.save({
      ...role,
      epis: [createdEpi],
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const createdEpi2 = await epiRepository.save({
      nome: 'Capacete',
      descricao: 'Descrição Teste',
      equipamentos: 'Teste',
      criadoPor: createdUser,
    });

    const updateData: UpdateRoleDto = {
      nome: 'Coordenador',
      epis: [createdEpi2.id],
      atualizadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcoes/${createdRole.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: expect.any(Number),
        nome: updateData.nome,
        epis: [
          {
            id: createdEpi2.id,
            nome: createdEpi2.nome,
          },
        ],
        atualizadoPor: expect.any(String),
      },
      message: `Função id: #${createdRole.id} atualizada com sucesso.`,
    });

    const logsRepository = dataSource.getRepository(RoleEpiLogs);
    const logs = await logsRepository.find({
      where: {
        funcao: { id: createdRole.id },
        epi: { id: createdEpi.id },
        acao: RoleEpiAction.REMOVEU,
      },
    });

    expect(logs.length).toBe(1);
    expect(logs[0]).toMatchObject({
      acao: RoleEpiAction.REMOVEU,
      descricao: `O usuário ${createdUser.id} removeu o EPI ${createdEpi.id} da função ${createdRole.id}.`,
      criadoPor: createdUser.id,
    });
  });

  it('/v1/empresas/funcoes/:id (PATCH) - Deve retornar erro ao não informar o ID do responsável pela atualização', async () => {
    const roleRepository = dataSource.getRepository(Role);
    const createdRole = await roleRepository.save({
      ...role,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 'Coordenador',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcoes/${createdRole.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O usuário responsável pela atualização deve ser informado.',
      ]),
    );
  });

  it('/v1/empresas/funcoes/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não seja um número', async () => {
    const roleRepository = dataSource.getRepository(Role);
    const createdRole = await roleRepository.save({
      ...role,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 'Coordenador',
      atualizadoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcoes/${createdRole.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O identificador do usuário deve ser um número.',
      ]),
    );
  });

  it('/v1/empresas/funcoes/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não exista', async () => {
    const roleRepository = dataSource.getRepository(Role);
    const createdRole = await roleRepository.save({
      ...role,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 'Coordenador',
      atualizadoPor: 999,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcoes/${createdRole.id}`)
      .send(updateData)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/funcoes/:id (PATCH) - Deve retornar erro ao atualizar uma função com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/funcoes/abc')
      .send({
        nome: 'Coordenador',
        atualizadoPor: 1,
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/funcoes/:id (PATCH) - Deve retornar erro ao atualizar um função inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/funcoes/9999')
      .send({
        nomeFantasia: 'Função Inexistente',
        atualizadoPor: 1,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Função não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/funcoes/:id (PATCH) - Deve retornar erro ao atualizar uma função com os mesmos dados', async () => {
    const roleRepository = dataSource.getRepository(Role);
    const createdRole = await roleRepository.save({
      ...role,
      epis: [createdEpi],
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: createdRole.nome,
      epis: [createdEpi.id],
      atualizadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcoes/${createdRole.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      `Nenhuma alteração foi feita na função #${createdRole.id}.`,
    );
  });

  it('/v1/empresas/funcoes/:id (PATCH) - Deve retornar erro ao atualizar uma função com tipo de dado inválido no nome', async () => {
    const roleRepository = dataSource.getRepository(Role);
    const createdRole = await roleRepository.save({
      ...role,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 123,
      atualizadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcoes/${createdRole.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['nome must be a string']),
    );
  });

  it('/v1/empresas/funcoes/:id (PATCH) - Deve retornar erro ao atualizar uma função com tipo de dado inválido em epi(s)', async () => {
    const roleRepository = dataSource.getRepository(Role);
    const createdRole = await roleRepository.save({
      ...role,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 'Coordenador',
      epis: ['Teste'],
      atualizadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcoes/${createdRole.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O identificador do(s) epi(s) deve ser um número',
      ]),
    );
  });

  it('/v1/empresas/funcoes/:id (PATCH) - Deve retornar erro ao atualizar uma função caso o id do(s) epi(s) não exista(m)', async () => {
    const roleRepository = dataSource.getRepository(Role);
    const createdRole = await roleRepository.save({
      ...role,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 'Coordenador',
      epis: [999],
      atualizadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/funcoes/${createdRole.id}`)
      .send(updateData)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Epi(s) não encontrado(s).',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/funcoes/:id (DELETE) - Deve excluir um função', async () => {
    const roleRepository = dataSource.getRepository(Role);
    const createdRole = await roleRepository.save({
      ...role,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const deleleRoleDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/funcoes/${createdRole.id}`)
      .send(deleleRoleDto)
      .expect(200);

    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: `Função id: #${createdRole.id} excluída com sucesso.`,
    });

    const deletedrole = await roleRepository.findOneBy({
      id: createdRole.id,
    });

    expect(deletedrole.status).toBe('E');
  });

  it('/v1/empresas/funcoes/:id (DELETE) - Deve retornar erro ao não informar o ID do responsável pela exclusão', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/funcoes/1`)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O usuário responsável pela exclusão deve ser informado.',
      ]),
    );
  });

  it('/v1/empresas/funcoes/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não seja um número', async () => {
    const deleleRoleDto = {
      excluidoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/funcoes/1`)
      .send(deleleRoleDto)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O identificador do usuário deve ser um número.',
      ]),
    );
  });

  it('/v1/empresas/funcoes/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não exista', async () => {
    const deleleRoleDto: BaseDeleteDto = {
      excluidoPor: 999,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/funcoes/${createdCompany.id}`)
      .send(deleleRoleDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/funcoes/:id (DELETE) - Deve retornar erro ao excluir um função com um ID inválido', async () => {
    const deleleRoleDto: BaseDeleteDto = {
      excluidoPor: 1,
    };

    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/funcoes/abc')
      .send(deleleRoleDto)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/funcoes/:id (DELETE) - Deve retornar erro ao excluir um função inexistente', async () => {
    const deleleRoleDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/funcoes/9999')
      .send(deleleRoleDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Função não encontrada.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
