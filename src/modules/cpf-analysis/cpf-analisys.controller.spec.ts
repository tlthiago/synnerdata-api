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
import { User } from '../users/entities/user.entity';
import {
  Escala,
  EstadoCivil,
  GrauInstrucao,
  RegimeContratacao,
  Sexo,
} from '../employees/enums/employees.enum';
import { CpfAnalysisModule } from './cpf-analysis.module';

describe('CpfAnalysisController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let createdUser: User;
  let createdEmployee: Employee;
  const cpfAnalysis = {
    descricao: 'Teste de descrição',
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
        CpfAnalysisModule,
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
    const roleRepository = dataSource.getRepository(Role);
    const departmentRepository = dataSource.getRepository(Department);
    const companyRepository = dataSource.getRepository(Company);
    const cboRepository = dataSource.getRepository(Cbo);
    const employeeRepository = dataSource.getRepository(Employee);

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
    const createdCompany = await companyRepository.save(company);

    const role = roleRepository.create({
      nome: 'Função Teste',
      criadoPor: createdUser,
    });
    const createdRole = await roleRepository.save(role);

    const department = departmentRepository.create({
      nome: 'Departamento Teste',
      criadoPor: createdUser,
    });
    const createdDepartment = await departmentRepository.save(department);

    const cbo = cboRepository.create({
      nome: 'Cbo Teste',
      criadoPor: user,
    });
    const createdCbo = await cboRepository.save(cbo);

    const employee = employeeRepository.create({
      nome: 'Funcionário Teste',
      carteiraIdentidade: 'MG-18.821.128',
      cpf: '13420162626',
      sexo: Sexo.MASCULINO,
      dataNascimento: '1996-10-15',
      estadoCivil: EstadoCivil.SOLTEIRO,
      naturalidade: 'Belo Horizonte',
      nacionalidade: 'Brasileiro',
      altura: 1.73,
      peso: 73.3,
      nomePai: 'Nome do Pai',
      nomeMae: 'Nome da Mãe',
      email: 'email@teste.com.br',
      pis: '12345678910',
      ctpsNumero: '1234567',
      ctpsSerie: '1234',
      certificadoReservista: '12345678910203',
      regimeContratacao: RegimeContratacao.CLT,
      dataAdmissao: '2025-02-12',
      salario: 3799,
      dataUltimoASO: '2025-02-12',
      funcao: createdRole,
      setor: createdDepartment,
      vencimentoExperiencia1: '2025-02-12',
      vencimentoExperiencia2: '2025-05-12',
      dataExameDemissional: '2025-05-12',
      grauInstrucao: GrauInstrucao.SUPERIOR,
      necessidadesEspeciais: false,
      filhos: false,
      celular: '31991897926',
      gestor: 'Gestor Teste',
      cbo: createdCbo,
      rua: 'Rua Teste',
      numero: '1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01000-000',
      quantidadeOnibus: 1,
      cargaHoraria: 60,
      escala: Escala.SEIS_UM,
      empresa: createdCompany,
      criadoPor: createdUser,
    });
    createdEmployee = await employeeRepository.save(employee);
  }, 50000);

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.query('DELETE FROM "analise_de_cpf" CASCADE;');
    }
  });

  it('/v1/funcionarios/:funcionarioId/analises-de-cpf (POST) - Deve cadastrar uma análise de cpf', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/analises-de-cpf`)
      .send(cpfAnalysis)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: `Análise de CPF cadastrada com sucesso, id: #1.`,
    });
  });

  it('/v1/funcionarios/:funcionarioId/analises-de-cpf (POST) - Deve retornar erro ao criar uma análise de cpf sem informações obrigatórias', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/analises-de-cpf`)
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'descricao should not be empty',
        'criadoPor should not be empty',
      ]),
    );
  });

  it('/v1/funcionarios/:funcionarioId/analises-de-cpf (POST) - Deve retornar erro ao criar uma análise de cpf com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/analises-de-cpf`)
      .send({ ...cpfAnalysis, descricao: 123 })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['descricao must be a string']),
    );
  });

  it('/v1/funcionarios/:funcionarioId/analises-de-cpf (POST) - Deve retornar erro caso o ID do funcionário não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/999/analises-de-cpf`)
      .send({
        ...cpfAnalysis,
        criadoPor: createdUser.id,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Funcionário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/:funcionarioId/analises-de-cpf (POST) - Deve retornar erro caso o ID do responsável pela criação não seja um número', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/analises-de-cpf`)
      .send({
        ...cpfAnalysis,
        criadoPor: 'Teste',
      })
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'criadoPor must be a number conforming to the specified constraints',
      ]),
    );
  });

  it('/v1/funcionarios/:funcionarioId/analises-de-cpf (POST) - Deve retornar erro caso o ID do responsável pela criação não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/analises-de-cpf`)
      .send({
        ...cpfAnalysis,
        criadoPor: 999,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/:funcionarioId/analises-de-cpf (GET) - Deve listar todas as demissões de um funcionário', async () => {
    const cpfAnalysisRepository = dataSource.getRepository(CpfAnalysis);
    await cpfAnalysisRepository.save({
      ...cpfAnalysis,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/${createdEmployee.id}/analises-de-cpf`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/funcionarios/analises-de-cpf/:id (GET) - Deve retonar uma análise de cpf específica', async () => {
    const cpfAnalysisRepository = dataSource.getRepository(CpfAnalysis);
    const createdCpfAnalysis = await cpfAnalysisRepository.save({
      ...cpfAnalysis,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/analises-de-cpf/${createdCpfAnalysis.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdCpfAnalysis.id,
      descricao: createdCpfAnalysis.descricao,
    });
  });

  it('/v1/funcionarios/analises-de-cpf/:id (GET) - Deve retornar erro ao buscar uma análise de cpf inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/funcionarios/analises-de-cpf/999')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Análise de CPF não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/analises-de-cpf/:id (GET) - Deve retornar erro ao buscar uma análise de cpf com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/funcionarios/analises-de-cpf/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/analises-de-cpf/:id (PATCH) - Deve atualizar os dados de uma análise de cpf', async () => {
    const cpfAnalysisRepository = dataSource.getRepository(CpfAnalysis);
    const createdCpfAnalysis = await cpfAnalysisRepository.save({
      ...cpfAnalysis,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const updateData = {
      descricao: 'Descrição atualizada.',
      atualizadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/analises-de-cpf/${createdCpfAnalysis.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: expect.any(Number),
        descricao: updateData.descricao,
        atualizadoPor: expect.any(String),
      },
      message: `Análise de CPF id: #${createdCpfAnalysis.id} atualizada com sucesso.`,
    });

    const updatedCpfAnalysis = await cpfAnalysisRepository.findOneBy({
      id: createdCpfAnalysis.id,
    });

    expect(updatedCpfAnalysis.descricao).toBe(updateData.descricao);
  });

  it('/v1/funcionarios/analises-de-cpf/:id (PATCH) - Deve retornar um erro ao atualizar um análise de cpf com tipo de dado inválido', async () => {
    const cpfAnalysisRepository = dataSource.getRepository(CpfAnalysis);
    const createdCpfAnalysis = await cpfAnalysisRepository.save({
      ...cpfAnalysis,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const updateData = {
      descricao: 123,
      atualizadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/analises-de-cpf/${createdCpfAnalysis.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['descricao must be a string']),
    );
  });

  it('/v1/funcionarios/analises-de-cpf/:id (PATCH) - Deve retornar erro ao não informar o ID do responsável pela atualização', async () => {
    const cpfAnalysisRepository = dataSource.getRepository(CpfAnalysis);
    const createdCpfAnalysis = await cpfAnalysisRepository.save({
      ...cpfAnalysis,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const updateData = {
      descricao: 'Descrição teste',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/analises-de-cpf/${createdCpfAnalysis.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O usuário responsável pela atualização deve ser informado.',
      ]),
    );
  });

  it('/v1/funcionarios/analises-de-cpf/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não seja um número', async () => {
    const cpfAnalysisRepository = dataSource.getRepository(CpfAnalysis);
    const createdCpfAnalysis = await cpfAnalysisRepository.save({
      ...cpfAnalysis,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const updateData = {
      data: '2025-02-11',
      atualizadoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/analises-de-cpf/${createdCpfAnalysis.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O identificador do usuário deve ser um número.',
      ]),
    );
  });

  it('/v1/funcionarios/analises-de-cpf/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não exista', async () => {
    const cpfAnalysisRepository = dataSource.getRepository(CpfAnalysis);
    const createdCpfAnalysis = await cpfAnalysisRepository.save({
      ...cpfAnalysis,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const updateData = {
      data: '2025-02-11',
      atualizadoPor: 999,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/analises-de-cpf/${createdCpfAnalysis.id}`)
      .send(updateData)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/analises-de-cpf/:id (PATCH) - Deve retornar erro ao atualizar uma análise de cpf com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/funcionarios/analises-de-cpf/abc')
      .send({
        data: '2025-02-11',
        atualizadoPor: 1,
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/analises-de-cpf/:id (PATCH) - Deve retornar erro ao atualizar uma análise de cpf inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/funcionarios/analises-de-cpf/9999')
      .send({
        data: '2025-02-11',
        atualizadoPor: 1,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Análise de CPF não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/analises-de-cpf/:id (DELETE) - Deve excluir uma análise de cpf', async () => {
    const cpfAnalysisRepository = dataSource.getRepository(CpfAnalysis);
    const createdCpfAnalysis = await cpfAnalysisRepository.save({
      ...cpfAnalysis,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const deleteCpfAnalysisDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/funcionarios/analises-de-cpf/${createdCpfAnalysis.id}`)
      .send(deleteCpfAnalysisDto)
      .expect(200);

    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: `Análise de CPF id: #${createdCpfAnalysis.id} excluída com sucesso.`,
    });

    const deletedCpfAnalysis = await cpfAnalysisRepository.findOneBy({
      id: createdCpfAnalysis.id,
    });

    expect(deletedCpfAnalysis.status).toBe('E');
  });

  it('/v1/funcionarios/analises-de-cpf/:id (DELETE) - Deve retornar erro ao não informar o ID do responsável pela exclusão', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/v1/funcionarios/analises-de-cpf/1`)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O usuário responsável pela exclusão deve ser informado.',
      ]),
    );
  });

  it('/v1/funcionarios/analises-de-cpf/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não seja um número', async () => {
    const deleteCpfAnalysisDto = {
      excluidoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/funcionarios/analises-de-cpf/1`)
      .send(deleteCpfAnalysisDto)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O identificador do usuário deve ser um número.',
      ]),
    );
  });

  it('/v1/funcionarios/analises-de-cpf/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não exista', async () => {
    const deleteCpfAnalysisDto: BaseDeleteDto = {
      excluidoPor: 999,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/funcionarios/analises-de-cpf/${createdEmployee.id}`)
      .send(deleteCpfAnalysisDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/analises-de-cpf/:id (DELETE) - Deve retornar erro ao excluir uma análise de cpf com um ID inválido', async () => {
    const deleteCpfAnalysisDto: BaseDeleteDto = {
      excluidoPor: 1,
    };

    const response = await request(app.getHttpServer())
      .delete('/v1/funcionarios/analises-de-cpf/abc')
      .send(deleteCpfAnalysisDto)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/analises-de-cpf/:id (DELETE) - Deve retornar erro ao excluir uma análise de cpf inexistente', async () => {
    const deleteCpfAnalysisDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete('/v1/funcionarios/analises-de-cpf/9999')
      .send(deleteCpfAnalysisDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Análise de CPF não encontrada.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
