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
import { UpdateCompanyDto } from './dto/update-company.dto';
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

describe('CompaniesController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;

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
  }, 20000);

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.query('DELETE FROM "empresas" CASCADE;');
    }
  });

  it('/v1/empresas (POST) - Deve cadastrar uma empresa', async () => {
    const userRepository = dataSource.getRepository(User);

    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste1@example.com',
      senha: 'senha123',
      funcao: 'teste',
    });
    await userRepository.save(createdUser);

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
      telefone: '(11) 99999-9999',
      faturamento: 1200000.5,
      regimeTributario: 'Simples Nacional',
      inscricaoEstadual: '1234567890',
      cnaePrincipal: '6201500',
      segmento: 'Tecnologia',
      ramoAtuacao: 'Desenvolvimento de Software',
      logoUrl: 'https://example.com/logo.png',
      status: 'A',
      criadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .post('/v1/empresas')
      .send(company)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: `Empresa cadastrada com sucesso, ID: 1.`,
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
      expect.arrayContaining([
        'nomeFantasia should not be empty',
        'razaoSocial should not be empty',
        'cnpj should not be empty',
        'rua should not be empty',
        'numero should not be empty',
        'bairro should not be empty',
        'cidade should not be empty',
        'estado should not be empty',
        'cep should not be empty',
        'dataFundacao should not be empty',
        'telefone should not be empty',
        'faturamento should not be empty',
        'regimeTributario should not be empty',
        'inscricaoEstadual should not be empty',
        'cnaePrincipal should not be empty',
        'segmento should not be empty',
        'ramoAtuacao should not be empty',
        'criadoPor should not be empty',
      ]),
    );
  });

  it('/v1/empresas (POST) - Deve retornar erro ao criar uma empresa com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/empresas')
      .send({
        nomeFantasia: 'Empresa Teste',
        razaoSocial: 'Empresa Teste LTDA',
        cnpj: '12345678000199',
        rua: 'Rua Teste',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01000-000',
        dataFundacao: '2020-01-01',
        telefone: '(11) 99999-9999',
        faturamento: 'um milhão',
        regimeTributario: 'Simples Nacional',
        inscricaoEstadual: '123456789',
        cnaePrincipal: '6201500',
        segmento: 'Tecnologia',
        ramoAtuacao: 'Desenvolvimento de Software',
        criadoPor: 1,
      })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'faturamento must be a number conforming to the specified constraints',
      ]),
    );
  });

  it('/v1/empresas (POST) - Deve retornar erro ao criar uma empresa com CNPJ já cadastrado', async () => {
    const userRepository = dataSource.getRepository(User);
    const companyRepository = dataSource.getRepository(Company);

    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste2@example.com',
      senha: 'senha123',
      funcao: 'teste',
    });
    await userRepository.save(createdUser);

    const existingCompany = companyRepository.create({
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

    await companyRepository.save(existingCompany);

    const duplicateCompany = {
      nomeFantasia: 'Another Tech',
      razaoSocial: 'Another Tech LTDA',
      cnpj: '12345678004175',
      rua: 'Rua Nova',
      numero: '456',
      complemento: 'Sala 20',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01001-000',
      dataFundacao: '2015-08-10',
      telefone: '(11) 98888-7777',
      faturamento: 500000.0,
      regimeTributario: 'Lucro Presumido',
      inscricaoEstadual: '9876543210',
      cnaePrincipal: '6202100',
      segmento: 'TI',
      ramoAtuacao: 'Consultoria',
      logoUrl: 'https://example.com/another-logo.png',
      status: 'A',
      criadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .post('/v1/empresas')
      .send(duplicateCompany)
      .expect(409);

    expect(response.body.message).toContain(
      'Já existe uma empresa com o mesmo CNPJ.',
    );
  });

  it('/v1/empresas (GET) - Deve listar todas as empresas', async () => {
    const userRepository = dataSource.getRepository(User);
    const companyRepository = dataSource.getRepository(Company);

    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste3@example.com',
      senha: 'senha123',
      funcao: 'teste',
    });
    await userRepository.save(createdUser);

    const createdCompany = companyRepository.create({
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
    await companyRepository.save(createdCompany);

    const response = await request(app.getHttpServer())
      .get('/v1/empresas')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/empresas/:id (GET) - Deve retonar uma empresa específica', async () => {
    const userRepository = dataSource.getRepository(User);
    const companyRepository = dataSource.getRepository(Company);

    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste4@example.com',
      senha: 'senha123',
      funcao: 'teste',
    });
    await userRepository.save(createdUser);

    const createdCompany = companyRepository.create({
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
      .get('/v1/empresas/9999')
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
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/:id (PATCH) - Deve atualizar os dados de uma empresa', async () => {
    const userRepository = dataSource.getRepository(User);
    const companyRepository = dataSource.getRepository(Company);

    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste5@example.com',
      senha: 'senha123',
      funcao: 'teste',
    });
    await userRepository.save(createdUser);

    const createdCompany = companyRepository.create({
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

    await companyRepository.save(createdCompany);

    const updateData: UpdateCompanyDto = {
      nomeFantasia: 'Tech Solutions Updated',
      telefone: '(11) 98888-7777',
      atualizadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/${createdCompany.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: expect.any(Number),
        nomeFantasia: 'Tech Solutions Updated',
        atualizadoPor: expect.any(String),
      },
      message: 'Empresa atualizada com sucesso.',
    });

    const updatedCompany = await companyRepository.findOneBy({
      id: createdCompany.id,
    });

    expect(updatedCompany.nomeFantasia).toBe(updateData.nomeFantasia);
    expect(updatedCompany.telefone).toBe(updateData.telefone);
  });

  it('/v1/empresas/:id (PATCH) - Deve retornar erro ao não informar o ID do responsável pela atualização', async () => {
    const userRepository = dataSource.getRepository(User);
    const companyRepository = dataSource.getRepository(Company);

    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste7@example.com',
      senha: 'senha123',
      funcao: 'teste',
    });
    await userRepository.save(createdUser);

    const createdCompany = companyRepository.create({
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

    await companyRepository.save(createdCompany);

    const updateCompanyDto = {
      nomeFantasia: 'Tech Solutions Updated',
      telefone: '(11) 98888-7777',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/usuarios/${createdCompany.id}`)
      .send(updateCompanyDto)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining(['atualizadoPor should not be empty']),
    );
  });

  it('/v1/empresas/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não seja um número', async () => {
    const userRepository = dataSource.getRepository(User);
    const companyRepository = dataSource.getRepository(Company);

    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste8@example.com',
      senha: 'senha123',
      funcao: 'teste',
    });
    await userRepository.save(createdUser);

    const createdCompany = companyRepository.create({
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

    await companyRepository.save(createdCompany);

    const updateCompanyDto = {
      nomeFantasia: 'Tech Solutions Updated',
      telefone: '(11) 98888-7777',
      atualizadoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/usuarios/${createdCompany.id}`)
      .send(updateCompanyDto)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'atualizadoPor must be a number conforming to the specified constraints',
      ]),
    );
  });

  it('/v1/empresas/:id (PATCH) - Deve retornar erro ao atualizar uma empresa com um CNPJ já cadastrado', async () => {
    const userRepository = dataSource.getRepository(User);
    const companyRepository = dataSource.getRepository(Company);

    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste6@example.com',
      senha: 'senha123',
      funcao: 'teste',
    });
    await userRepository.save(createdUser);

    const company1 = companyRepository.create({
      nomeFantasia: 'Empresa A',
      razaoSocial: 'Empresa A LTDA',
      cnpj: '12345678000199',
      rua: 'Rua A',
      numero: '100',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01000-000',
      dataFundacao: '2010-05-15',
      telefone: '(11) 99999-9999',
      faturamento: 500000,
      regimeTributario: 'Simples Nacional',
      inscricaoEstadual: '123456789',
      cnaePrincipal: '6201500',
      segmento: 'Tecnologia',
      ramoAtuacao: 'Desenvolvimento de Software',
      logoUrl: 'https://example.com/logo.png',
      status: 'A',
      criadoPor: createdUser,
    });
    await companyRepository.save(company1);

    const company2 = companyRepository.create({
      nomeFantasia: 'Empresa B',
      razaoSocial: 'Empresa B LTDA',
      cnpj: '98765432000188',
      rua: 'Rua B',
      numero: '200',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '20000-000',
      dataFundacao: '2010-05-15',
      telefone: '(21) 99999-9999',
      faturamento: 800000,
      regimeTributario: 'Lucro Presumido',
      inscricaoEstadual: '987654321',
      cnaePrincipal: '6202300',
      segmento: 'Consultoria',
      ramoAtuacao: 'Consultoria em TI',
      logoUrl: 'https://example.com/logo.png',
      status: 'A',
      criadoPor: createdUser,
    });
    await companyRepository.save(company2);

    const response = await request(app.getHttpServer())
      .patch(`/v1/empresas/${company2.id}`)
      .send({
        cnpj: company1.cnpj,
        atualizadoPor: createdUser.id,
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
        atualizadoPor: 1,
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/:id (PATCH) - Deve retornar erro ao atualizar uma empresa inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/empresas/9999')
      .send({
        nomeFantasia: 'Empresa Inexistente',
        atualizadoPor: 1,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:id (DELETE) - Deve excluir uma empresa', async () => {
    const userRepository = dataSource.getRepository(User);
    const companyRepository = dataSource.getRepository(Company);

    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste9@example.com',
      senha: 'senha123',
      funcao: 'teste',
    });
    await userRepository.save(createdUser);

    const createdCompany = companyRepository.create({
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

    await companyRepository.save(createdCompany);

    const deleleCompanyDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/${createdCompany.id}`)
      .send(deleleCompanyDto)
      .expect(200);

    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: `Empresa id: #${createdCompany.id} excluída com sucesso.`,
    });

    const deletedCompany = await companyRepository.findOneBy({
      id: createdCompany.id,
    });

    expect(deletedCompany.status).toBe('E');
  });

  it('/v1/empresas/:id (DELETE) - Deve retornar erro ao não informar o ID do responsável pela exclusão', async () => {
    const userRepository = dataSource.getRepository(User);
    const companyRepository = dataSource.getRepository(Company);

    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste10@example.com',
      senha: 'senha123',
      funcao: 'teste',
    });
    await userRepository.save(createdUser);

    const createdCompany = companyRepository.create({
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

    await companyRepository.save(createdCompany);

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/${createdCompany.id}`)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O usuário responsável pela exclusão deve ser informado.',
      ]),
    );
  });

  it('/v1/empresas/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não seja um número', async () => {
    const userRepository = dataSource.getRepository(User);
    const companyRepository = dataSource.getRepository(Company);

    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste11@example.com',
      senha: 'senha123',
      funcao: 'teste',
    });
    await userRepository.save(createdUser);

    const createdCompany = companyRepository.create({
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

    await companyRepository.save(createdCompany);

    const deleleCompanyDto = {
      excluidoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/empresas/${createdCompany.id}`)
      .send(deleleCompanyDto)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O identificador do usuário deve ser um número.',
      ]),
    );
  });

  it('/v1/empresas/:id (DELETE) - Deve retornar erro ao excluir um empresa com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: expect.arrayContaining([
        'O identificador do usuário deve ser um número.',
        'O usuário responsável pela exclusão deve ser informado.',
      ]),
      error: 'Bad Request',
    });
  });

  it('/v1/empresas/:id (DELETE) - Deve retornar erro ao excluir uma empresa inexistente', async () => {
    const userRepository = dataSource.getRepository(User);

    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste12@example.com',
      senha: 'senha123',
      funcao: 'teste',
    });
    await userRepository.save(createdUser);

    const deleleCompanyDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete('/v1/empresas/9999')
      .send(deleleCompanyDto)
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
