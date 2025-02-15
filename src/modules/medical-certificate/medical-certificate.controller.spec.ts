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
import { MedicalCertificateModule } from './medical-certificate.module';

describe('atestadoController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let createdUser: User;
  let createdEmployee: Employee;
  const medicalCertificate = {
    dataInicio: '2025-02-10',
    dataFim: '2025-02-14',
    motivo: 'Motivo Teste',
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
        MedicalCertificateModule,
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
      await dataSource.query('DELETE FROM "atestados" CASCADE;');
    }
  });

  it('/v1/funcionarios/:funcionarioId/atestados (POST) - Deve cadastrar um atestado', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/atestados`)
      .send(medicalCertificate)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: `Atestado cadastrado com sucesso, id: #1.`,
    });
  });

  it('/v1/funcionarios/:funcionarioId/atestados (POST) - Deve retornar erro ao criar um atestado sem informações obrigatórias', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/atestados`)
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'dataInicio should not be empty',
        'criadoPor should not be empty',
      ]),
    );
  });

  it('/v1/funcionarios/:funcionarioId/atestados (POST) - Deve retornar erro ao criar um atestado com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/atestados`)
      .send({ ...medicalCertificate, dataInicio: 123 })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'dataInicio must be a valid ISO 8601 date string',
      ]),
    );
  });

  it('/v1/funcionarios/:funcionarioId/atestados (POST) - Deve retornar erro ao criar um atestado com data fim anterior a data inicio', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/atestados`)
      .send({
        ...medicalCertificate,
        dataInicio: '2025-02-14',
        dataFim: '2025-02-10',
      })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      'A data fim deve ser posterior à data início.',
    );
  });

  it('/v1/funcionarios/:funcionarioId/atestados (POST) - Deve retornar erro caso o ID do funcionário não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/999/atestados`)
      .send({
        ...medicalCertificate,
        criadoPor: createdUser.id,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Funcionário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/:funcionarioId/atestados (POST) - Deve retornar erro caso o ID do responsável pela criação não seja um número', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/atestados`)
      .send({
        ...medicalCertificate,
        criadoPor: 'Teste',
      })
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'criadoPor must be a number conforming to the specified constraints',
      ]),
    );
  });

  it('/v1/funcionarios/:funcionarioId/atestados (POST) - Deve retornar erro caso o ID do responsável pela criação não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/atestados`)
      .send({
        ...medicalCertificate,
        criadoPor: 999,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/:funcionarioId/atestados (GET) - Deve listar todos as atestados de um funcionário', async () => {
    const medicalCertificateRepository =
      dataSource.getRepository(MedicalCertificate);
    await medicalCertificateRepository.save({
      ...medicalCertificate,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/${createdEmployee.id}/atestados`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/funcionarios/atestados/:id (GET) - Deve retonar um atestado específico', async () => {
    const medicalCertificateRepository =
      dataSource.getRepository(MedicalCertificate);
    const createdMedicalCertificate = await medicalCertificateRepository.save({
      ...medicalCertificate,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/atestados/${createdMedicalCertificate.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdMedicalCertificate.id,
      dataInicio: new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
      }).format(new Date(createdMedicalCertificate.dataInicio)),
    });
  });

  it('/v1/funcionarios/atestados/:id (GET) - Deve retornar erro ao buscar um atestado inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/funcionarios/atestados/999')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Atestado não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/atestados/:id (GET) - Deve retornar erro ao buscar um atestado com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/funcionarios/atestados/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/atestados/:id (PATCH) - Deve atualizar os dados de um atestado', async () => {
    const medicalCertificateRepository =
      dataSource.getRepository(MedicalCertificate);
    const createdMedicalCertificate = await medicalCertificateRepository.save({
      ...medicalCertificate,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const updateData = {
      dataInicio: new Date('2025-02-20T00:00:00-03:00'),
      dataFim: new Date('2025-02-25T00:00:00-03:00'),
      atualizadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/atestados/${createdMedicalCertificate.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: expect.any(Number),
        dataInicio: expect.any(String),
        atualizadoPor: expect.any(String),
      },
      message: `Atestado id: #${createdMedicalCertificate.id} atualizada com sucesso.`,
    });

    const updatedMedicalCertificate =
      await medicalCertificateRepository.findOneBy({
        id: createdMedicalCertificate.id,
      });

    expect(
      new Date(updatedMedicalCertificate.dataInicio)
        .toISOString()
        .split('T')[0],
    ).toBe(new Date(updateData.dataInicio).toISOString().split('T')[0]);
  });

  it('/v1/funcionarios/atestados/:id (PATCH) - Deve retornar um erro ao atualizar um atestado com tipo de dado inválido', async () => {
    const medicalCertificateRepository =
      dataSource.getRepository(MedicalCertificate);
    const createdMedicalCertificate = await medicalCertificateRepository.save({
      ...medicalCertificate,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const updateData = {
      dataInicio: 123,
      atualizadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/atestados/${createdMedicalCertificate.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'dataInicio must be a valid ISO 8601 date string',
      ]),
    );
  });

  it('/v1/funcionarios/atestados/:id (PATCH) - Deve retornar erro ao não informar o ID do responsável pela atualização', async () => {
    const medicalCertificateRepository =
      dataSource.getRepository(MedicalCertificate);
    const createdMedicalCertificate = await medicalCertificateRepository.save({
      ...medicalCertificate,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const updateData = {
      dataInicio: '2025-02-11',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/atestados/${createdMedicalCertificate.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O usuário responsável pela atualização deve ser informado.',
      ]),
    );
  });

  it('/v1/funcionarios/atestados/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não seja um número', async () => {
    const medicalCertificateRepository =
      dataSource.getRepository(MedicalCertificate);
    const createdMedicalCertificate = await medicalCertificateRepository.save({
      ...medicalCertificate,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const updateData = {
      dataInicio: '2025-02-11',
      atualizadoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/atestados/${createdMedicalCertificate.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O identificador do usuário deve ser um número.',
      ]),
    );
  });

  it('/v1/funcionarios/atestados/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não exista', async () => {
    const medicalCertificateRepository =
      dataSource.getRepository(MedicalCertificate);
    const createdMedicalCertificate = await medicalCertificateRepository.save({
      ...medicalCertificate,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const updateData = {
      dataInicio: '2025-02-11',
      atualizadoPor: 999,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/atestados/${createdMedicalCertificate.id}`)
      .send(updateData)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/atestados/:id (PATCH) - Deve retornar erro ao atualizar um atestado com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/funcionarios/atestados/abc')
      .send({
        dataInicio: '2025-02-11',
        atualizadoPor: 1,
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/atestados/:id (PATCH) - Deve retornar erro ao atualizar uma atestado inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/funcionarios/atestados/9999')
      .send({
        dataInicio: '2025-02-11',
        dataFim: '2025-02-14',
        atualizadoPor: 1,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Atestado não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/atestados/:id (DELETE) - Deve excluir um atestado', async () => {
    const medicalCertificateRepository =
      dataSource.getRepository(MedicalCertificate);
    const createdMedicalCertificate = await medicalCertificateRepository.save({
      ...medicalCertificate,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const deleteMedicalCertificateDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/funcionarios/atestados/${createdMedicalCertificate.id}`)
      .send(deleteMedicalCertificateDto)
      .expect(200);

    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: `Atestado id: #${createdMedicalCertificate.id} excluído com sucesso.`,
    });

    const deletedmedicalcertificate =
      await medicalCertificateRepository.findOneBy({
        id: createdMedicalCertificate.id,
      });

    expect(deletedmedicalcertificate.status).toBe('E');
  });

  it('/v1/funcionarios/atestados/:id (DELETE) - Deve retornar erro ao não informar o ID do responsável pela exclusão', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/v1/funcionarios/atestados/1`)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O usuário responsável pela exclusão deve ser informado.',
      ]),
    );
  });

  it('/v1/funcionarios/atestados/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não seja um número', async () => {
    const deleteMedicalCertificateDto = {
      excluidoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/funcionarios/atestados/1`)
      .send(deleteMedicalCertificateDto)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O identificador do usuário deve ser um número.',
      ]),
    );
  });

  it('/v1/funcionarios/atestados/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não exista', async () => {
    const deleteMedicalCertificateDto: BaseDeleteDto = {
      excluidoPor: 999,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/funcionarios/atestados/${createdEmployee.id}`)
      .send(deleteMedicalCertificateDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/atestados/:id (DELETE) - Deve retornar erro ao excluir um atestado com um ID inválido', async () => {
    const deleteMedicalCertificateDto: BaseDeleteDto = {
      excluidoPor: 1,
    };

    const response = await request(app.getHttpServer())
      .delete('/v1/funcionarios/atestados/abc')
      .send(deleteMedicalCertificateDto)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/atestados/:id (DELETE) - Deve retornar erro ao excluir um atestado inexistente', async () => {
    const deleteMedicalCertificateDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete('/v1/funcionarios/atestados/9999')
      .send(deleteMedicalCertificateDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Atestado não encontrado.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
