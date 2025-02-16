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
import { TerminationsModule } from './terminations.module';

describe('TerminationController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let createdUser: User;
  let createdEmployee: Employee;
  const termination = {
    data: '2025-02-16',
    motivoInterno: 'Motivo teste',
    motivoTrabalhista: 'Motivo teste',
    acaoTrabalhista: '123456789',
    formaDemissao: 'Teste de forma',
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
        TerminationsModule,
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
      await dataSource.query('DELETE FROM "demissoes" CASCADE;');
    }
  });

  it('/v1/funcionarios/:funcionarioId/demissoes (POST) - Deve cadastrar uma demissão', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/demissoes`)
      .send(termination)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: `Demissão cadastrada com sucesso, id: #1.`,
    });

    const employeeRepository = dataSource.getRepository(Employee);
    const updatedEmployee = await employeeRepository.findOne({
      where: { id: createdEmployee.id },
    });

    expect(updatedEmployee.statusFuncionario).toBe('DEMITIDO');
  });

  it('/v1/funcionarios/:funcionarioId/demissoes (POST) - Deve retornar erro ao criar uma demissão sem informações obrigatórias', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/demissoes`)
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'data should not be empty',
        'criadoPor should not be empty',
      ]),
    );
  });

  it('/v1/funcionarios/:funcionarioId/demissoes (POST) - Deve retornar erro ao criar uma demissão com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/demissoes`)
      .send({ ...termination, data: 123 })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['data must be a valid ISO 8601 date string']),
    );
  });

  it('/v1/funcionarios/:funcionarioId/demissoes (POST) - Deve retornar erro caso o ID do funcionário não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/999/demissoes`)
      .send({
        ...termination,
        criadoPor: createdUser.id,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Funcionário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/:funcionarioId/demissoes (POST) - Deve retornar erro caso o ID do responsável pela criação não seja um número', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/demissoes`)
      .send({
        ...termination,
        criadoPor: 'Teste',
      })
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'criadoPor must be a number conforming to the specified constraints',
      ]),
    );
  });

  it('/v1/funcionarios/:funcionarioId/demissoes (POST) - Deve retornar erro caso o ID do responsável pela criação não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/demissoes`)
      .send({
        ...termination,
        criadoPor: 999,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/:funcionarioId/demissoes (GET) - Deve listar todas as demissões de um funcionário', async () => {
    const terminationRepository = dataSource.getRepository(Termination);
    await terminationRepository.save({
      ...termination,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/${createdEmployee.id}/demissoes`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/funcionarios/demissoes/:id (GET) - Deve retonar uma demissão específica', async () => {
    const terminationRepository = dataSource.getRepository(Termination);
    const createdTermination = await terminationRepository.save({
      ...termination,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/demissoes/${createdTermination.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdTermination.id,
      data: new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
      }).format(new Date(createdTermination.data)),
    });
  });

  it('/v1/funcionarios/demissoes/:id (GET) - Deve retornar erro ao buscar uma demissão inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/funcionarios/demissoes/999')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Demissão não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/demissoes/:id (GET) - Deve retornar erro ao buscar uma demissão com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/funcionarios/demissoes/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/demissoes/:id (PATCH) - Deve atualizar os dados de uma demissão', async () => {
    const terminationRepository = dataSource.getRepository(Termination);
    const createdTermination = await terminationRepository.save({
      ...termination,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const updateData = {
      data: new Date('2025-02-20T00:00:00-03:00'),
      atualizadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/demissoes/${createdTermination.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: expect.any(Number),
        data: expect.any(String),
        atualizadoPor: expect.any(String),
      },
      message: `Demissão id: #${createdTermination.id} atualizada com sucesso.`,
    });

    const updatedTermination = await terminationRepository.findOneBy({
      id: createdTermination.id,
    });

    expect(new Date(updatedTermination.data).toISOString().split('T')[0]).toBe(
      new Date(updateData.data).toISOString().split('T')[0],
    );
  });

  it('/v1/funcionarios/demissoes/:id (PATCH) - Deve retornar um erro ao atualizar um demissão com tipo de dado inválido', async () => {
    const terminationRepository = dataSource.getRepository(Termination);
    const createdTermination = await terminationRepository.save({
      ...termination,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const updateData = {
      data: 123,
      atualizadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/demissoes/${createdTermination.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['data must be a valid ISO 8601 date string']),
    );
  });

  it('/v1/funcionarios/demissoes/:id (PATCH) - Deve retornar erro ao não informar o ID do responsável pela atualização', async () => {
    const terminationRepository = dataSource.getRepository(Termination);
    const createdTermination = await terminationRepository.save({
      ...termination,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const updateData = {
      data: '2025-02-11',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/demissoes/${createdTermination.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O usuário responsável pela atualização deve ser informado.',
      ]),
    );
  });

  it('/v1/funcionarios/demissoes/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não seja um número', async () => {
    const terminationRepository = dataSource.getRepository(Termination);
    const createdTermination = await terminationRepository.save({
      ...termination,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const updateData = {
      data: '2025-02-11',
      atualizadoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/demissoes/${createdTermination.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O identificador do usuário deve ser um número.',
      ]),
    );
  });

  it('/v1/funcionarios/demissoes/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não exista', async () => {
    const terminationRepository = dataSource.getRepository(Termination);
    const createdTermination = await terminationRepository.save({
      ...termination,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const updateData = {
      data: '2025-02-11',
      atualizadoPor: 999,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/demissoes/${createdTermination.id}`)
      .send(updateData)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/demissoes/:id (PATCH) - Deve retornar erro ao atualizar uma demissão com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/funcionarios/demissoes/abc')
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

  it('/v1/funcionarios/demissoes/:id (PATCH) - Deve retornar erro ao atualizar uma demissão inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/funcionarios/demissoes/9999')
      .send({
        data: '2025-02-11',
        atualizadoPor: 1,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Demissão não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/demissoes/:id (DELETE) - Deve excluir uma demissão', async () => {
    const terminationRepository = dataSource.getRepository(Termination);
    const createdTermination = await terminationRepository.save({
      ...termination,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const deleteTerminationDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/funcionarios/demissoes/${createdTermination.id}`)
      .send(deleteTerminationDto)
      .expect(200);

    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: `Demissão id: #${createdTermination.id} excluída com sucesso.`,
    });

    const deletedTermination = await terminationRepository.findOneBy({
      id: createdTermination.id,
    });

    expect(deletedTermination.status).toBe('E');

    const employeeRepository = dataSource.getRepository(Employee);
    const updatedEmployee = await employeeRepository.findOne({
      where: { id: createdEmployee.id },
    });

    expect(updatedEmployee.statusFuncionario).toBe('ATIVO');
  });

  it('/v1/funcionarios/demissoes/:id (DELETE) - Deve retornar erro ao não informar o ID do responsável pela exclusão', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/v1/funcionarios/demissoes/1`)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O usuário responsável pela exclusão deve ser informado.',
      ]),
    );
  });

  it('/v1/funcionarios/demissoes/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não seja um número', async () => {
    const deleteTerminationDto = {
      excluidoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/funcionarios/demissoes/1`)
      .send(deleteTerminationDto)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O identificador do usuário deve ser um número.',
      ]),
    );
  });

  it('/v1/funcionarios/demissoes/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não exista', async () => {
    const deleteTerminationDto: BaseDeleteDto = {
      excluidoPor: 999,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/funcionarios/demissoes/${createdEmployee.id}`)
      .send(deleteTerminationDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/demissoes/:id (DELETE) - Deve retornar erro ao excluir uma demissão com um ID inválido', async () => {
    const deleteTerminationDto: BaseDeleteDto = {
      excluidoPor: 1,
    };

    const response = await request(app.getHttpServer())
      .delete('/v1/funcionarios/demissoes/abc')
      .send(deleteTerminationDto)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/demissoes/:id (DELETE) - Deve retornar erro ao excluir uma demissão inexistente', async () => {
    const deleteTerminationDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete('/v1/funcionarios/demissoes/9999')
      .send(deleteTerminationDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Demissão não encontrada.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
