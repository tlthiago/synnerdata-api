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
import { BranchesModule } from './branches.module';
import { UpdateBranchDto } from './dto/update-branch.dto';

describe('BranchesController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
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
    telefone: '(11) 99999-9999',
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
      await dataSource.query('DELETE FROM "filiais" CASCADE;');
    }
  });

  it('/v1/empresas/:empresaId/filiais (POST) - Deve cadastrar uma filial', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/filiais`)
      .send(branch)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: `Filial cadastrada com sucesso, id: #1.`,
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
      expect.arrayContaining([
        'nome should not be empty',
        'cnpj should not be empty',
        'rua should not be empty',
        'numero should not be empty',
        'bairro should not be empty',
        'cidade should not be empty',
        'estado should not be empty',
        'cep should not be empty',
        'dataFundacao should not be empty',
        'telefone should not be empty',
        'criadoPor should not be empty',
      ]),
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
      .post(`/v1/empresas/999/filiais`)
      .send({
        ...branch,
        criadoPor: createdUser.id,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/filiais (POST) - Deve retornar erro caso o ID do responsável pela criação não seja um número', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/filiais`)
      .send({
        ...branch,
        criadoPor: 'Teste',
      })
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'criadoPor must be a number conforming to the specified constraints',
      ]),
    );
  });

  it('/v1/empresas/:empresaId/filiais (POST) - Deve retornar erro caso o ID do responsável pela criação não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/empresas/${createdCompany.id}/filiais`)
      .send({
        ...branch,
        criadoPor: 999,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/filiais (POST) - Deve retornar erro ao criar uma filial com CNPJ já cadastrado em uma empresa', async () => {
    const branchesRepository = dataSource.getRepository(Branch);
    await branchesRepository.save({
      ...branch,
      empresa: createdCompany,
      criadoPor: createdUser,
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
      criadoPor: createdUser,
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
      criadoPor: createdUser,
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
      criadoPor: createdUser,
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
      .get('/v1/empresas/filiais/999')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Filial não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/filiais/:id (GET) - Deve retornar erro ao buscar um filial com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/empresas/filiais/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/filiais/:id (PATCH) - Deve atualizar os dados de uma filial', async () => {
    const branchesRepository = dataSource.getRepository(Branch);
    const createdBranch = await branchesRepository.save({
      ...branch,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData: UpdateBranchDto = {
      nome: 'Tech Solutions Filial Updated',
      telefone: '(11) 98888-7777',
      atualizadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/filiais/${createdBranch.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: expect.any(Number),
        nome: 'Tech Solutions Filial Updated',
        atualizadoPor: expect.any(String),
      },
      message: `Filial id: #${createdBranch.id} atualizada com sucesso.`,
    });

    const updatedBranch = await branchesRepository.findOneBy({
      id: createdBranch.id,
    });

    expect(updatedBranch.nome).toBe(updateData.nome);
    expect(updatedBranch.telefone).toBe(updateData.telefone);
  });

  it('/v1/empresas/filiais/:id (PATCH) - Deve retornar erro ao atualizar uma filial com tipo de dado inválido', async () => {
    const branchesRepository = dataSource.getRepository(Branch);
    const createdBranch = await branchesRepository.save({
      ...branch,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 123,
      telefone: '(11) 98888-7777',
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

  it('/v1/empresas/filiais/:id (PATCH) - Deve retornar erro ao não informar o ID do responsável pela atualização', async () => {
    const branchesRepository = dataSource.getRepository(Branch);
    const createdBranch = await branchesRepository.save({
      ...branch,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 'Tech Solutions Filial Updated',
      telefone: '(11) 98888-7777',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/filiais/${createdBranch.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O usuário responsável pela atualização deve ser informado.',
      ]),
    );
  });

  it('/v1/empresas/filiais/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não seja um número', async () => {
    const branchesRepository = dataSource.getRepository(Branch);
    const createdBranch = await branchesRepository.save({
      ...branch,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 'Tech Solutions Filial Updated',
      telefone: '(11) 98888-7777',
      atualizadoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/filiais/${createdBranch.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O identificador do usuário deve ser um número.',
      ]),
    );
  });

  it('/v1/empresas/filiais/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não exista', async () => {
    const branchesRepository = dataSource.getRepository(Branch);
    const createdBranch = await branchesRepository.save({
      ...branch,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const updateData = {
      nome: 'Tech Solutions Filial Updated',
      telefone: '(11) 98888-7777',
      atualizadoPor: 999,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/filiais/${createdBranch.id}`)
      .send(updateData)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/filiais/:id (PATCH) - Deve retornar erro ao atualizar uma filial com um CNPJ já cadastrado em uma empresa', async () => {
    const branchesRepository = dataSource.getRepository(Branch);
    const createdBranch = await branchesRepository.save({
      ...branch,
      empresa: createdCompany,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/filiais/${createdBranch.id}`)
      .send({
        ...branch,
        cnpj: createdCompany.cnpj,
        atualizadoPor: createdUser.id,
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
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/filiais/${createdBranch.id}`)
      .send({
        ...branch,
        atualizadoPor: createdUser.id,
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
        atualizadoPor: 1,
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/filiais/:id (PATCH) - Deve retornar erro ao atualizar uma filial inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/filiais/9999')
      .send({
        nomeFantasia: 'Empresa Inexistente',
        atualizadoPor: 1,
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
      criadoPor: createdUser,
    });

    const deleleBranchDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/filiais/${createdBranch.id}`)
      .send(deleleBranchDto)
      .expect(200);

    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: `Filial id: #${createdBranch.id} excluída com sucesso.`,
    });

    const deletedBranch = await branchesRepository.findOneBy({
      id: createdBranch.id,
    });

    expect(deletedBranch.status).toBe('E');
  });

  it('/v1/empresas/filiais/:id (DELETE) - Deve retornar erro ao não informar o ID do responsável pela exclusão', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/filiais/1`)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O usuário responsável pela exclusão deve ser informado.',
      ]),
    );
  });

  it('/v1/empresas/filiais/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não seja um número', async () => {
    const deleleBranchDto = {
      excluidoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/filiais/1`)
      .send(deleleBranchDto)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O identificador do usuário deve ser um número.',
      ]),
    );
  });

  it('/v1/empresas/filiais/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não exista', async () => {
    const deleleBranchDto: BaseDeleteDto = {
      excluidoPor: 999,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/filiais/${createdCompany.id}`)
      .send(deleleBranchDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/filiais/:id (DELETE) - Deve retornar erro ao excluir um filial com um ID inválido', async () => {
    const deleleBranchDto: BaseDeleteDto = {
      excluidoPor: 1,
    };

    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/filiais/abc')
      .send(deleleBranchDto)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/filiais/:id (DELETE) - Deve retornar erro ao excluir uma filial inexistente', async () => {
    const deleleBranchDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/filiais/9999')
      .send(deleleBranchDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Filial não encontrada.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
