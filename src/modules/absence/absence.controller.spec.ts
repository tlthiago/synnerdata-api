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
import { AbsenceModule } from './absence.module';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import {
  Escala,
  EstadoCivil,
  GrauInstrucao,
  RegimeContratacao,
  Sexo,
} from '../employees/enums/employees.enum';
import { MockUserInterceptor } from '../../common/interceptors/mock-user.interceptor';

describe('AbsenceController (E2E)', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let mockUserInterceptor: MockUserInterceptor;
  let createdUser: User;
  let createdEmployee: Employee;
  let createdCompany: Company;

  const absence = {
    data: '2025-01-29',
    motivo: 'Motivo Teste',
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
        AbsenceModule,
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
    const roleRepository = dataSource.getRepository(Role);
    const departmentRepository = dataSource.getRepository(Department);
    const companyRepository = dataSource.getRepository(Company);
    const cboRepository = dataSource.getRepository(Cbo);
    const employeeRepository = dataSource.getRepository(Employee);

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

    const role = roleRepository.create({
      nome: 'Função Teste',
    });
    const createdRole = await roleRepository.save(role);

    const department = departmentRepository.create({
      nome: 'Departamento Teste',
    });
    const createdDepartment = await departmentRepository.save(department);

    const cbo = cboRepository.create({
      nome: 'Cbo Teste',
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
      valorAlimentacao: 800,
      valorTransporte: 500,
      empresa: createdCompany,
    });
    createdEmployee = await employeeRepository.save(employee);
  }, 50000);

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.query('DELETE FROM "faltas" CASCADE;');
    }
  });

  it('/v1/funcionarios/:funcionarioId/faltas (POST) - Deve cadastrar uma falta', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/faltas`)
      .send(absence)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        motivo: absence.motivo,
      },
      message: expect.stringContaining('Falta cadastrada com sucesso, id: #'),
    });
  });

  it('/v1/funcionarios/:funcionarioId/faltas (POST) - Deve retornar erro ao tentar cadastrar outra falta para um dia que já possui falta cadastrada', async () => {
    const absenceRepository = dataSource.getRepository(Absence);
    await absenceRepository.save({
      ...absence,
      data: new Date(absence.data + 'T00:00:00.000Z'),
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/faltas`)
      .send(absence)
      .expect(409);

    expect(response.body).toEqual({
      statusCode: 409,
      message: 'O funcionário já possui uma falta registrada para este dia.',
      error: 'Conflict',
    });
  });

  it('/v1/funcionarios/:funcionarioId/faltas (POST) - Deve retornar erro ao criar uma falta sem informações obrigatórias', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/faltas`)
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining(['data should not be empty']),
    );
  });

  it('/v1/funcionarios/:funcionarioId/faltas (POST) - Deve retornar erro ao criar uma falta com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/${createdEmployee.id}/faltas`)
      .send({ ...absence, data: 123 })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['data must be a valid ISO 8601 date string']),
    );
  });

  it('/v1/funcionarios/:funcionarioId/faltas (POST) - Deve retornar erro caso o ID do funcionário não exista', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/funcionarios/86f226c4-38b0-464c-987e-35293033faf6/faltas`)
      .send({
        ...absence,
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Funcionário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/empresas/:empresaId/faltas (GET) - Deve listar todas as faltas de uma empresa', async () => {
    const absenceRepository = dataSource.getRepository(Absence);
    await absenceRepository.save({
      ...absence,
      funcionario: createdEmployee,
      criadoPor: createdUser,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/${createdCompany.id}/faltas`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/empresas/:empresaId/faltas (GET) - Deve retornar erro caso o ID da empresa não exista', async () => {
    const response = await request(app.getHttpServer())
      .get(`/v1/empresas/86f226c4-38b0-464c-987e-35293033faf6/faltas`)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Empresa não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/:funcionarioId/faltas (GET) - Deve listar todas as faltas de um funcionário', async () => {
    const absenceRepository = dataSource.getRepository(Absence);
    await absenceRepository.save({
      ...absence,
      funcionario: createdEmployee,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/${createdEmployee.id}/faltas`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/funcionarios/:funcionarioId/faltas (GET) - Deve retornar erro caso o ID do funcionário não exista', async () => {
    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/86f226c4-38b0-464c-987e-35293033faf6/faltas`)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Funcionário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/faltas/:id (GET) - Deve retonar uma falta específica', async () => {
    const absenceRepository = dataSource.getRepository(Absence);
    const createdAbsence = await absenceRepository.save({
      ...absence,
      funcionario: createdEmployee,
    });

    const response = await request(app.getHttpServer())
      .get(`/v1/funcionarios/faltas/${createdAbsence.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdAbsence.id,
      data: new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
      }).format(new Date(createdAbsence.data)),
    });
  });

  it('/v1/funcionarios/faltas/:id (GET) - Deve retornar erro ao buscar uma falta inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/funcionarios/faltas/86f226c4-38b0-464c-987e-35293033faf6')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Falta não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/faltas/:id (GET) - Deve retornar erro ao buscar uma falta com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/funcionarios/faltas/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/faltas/:id (PATCH) - Deve atualizar os dados de uma falta', async () => {
    const absenceRepository = dataSource.getRepository(Absence);
    const createdAbsence = await absenceRepository.save({
      ...absence,
      funcionario: createdEmployee,
    });

    const updateData: UpdateAbsenceDto = {
      data: '2025-02-13',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/faltas/${createdAbsence.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdAbsence.id,
        data: new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
        }).format(new Date(updateData.data)),
        atualizadoPor: createdUser.nome,
      },
      message: `Falta id: #${createdAbsence.id} atualizada com sucesso.`,
    });
  });

  it('/v1/funcionarios/faltas/:id (PATCH) - Deve retornar erro ao atualizar a data de uma falta para um dia que já possui falta cadastrada', async () => {
    const absenceRepository = dataSource.getRepository(Absence);
    await absenceRepository.save({
      ...absence,
      data: new Date(absence.data + 'T00:00:00.000Z'),
      funcionario: createdEmployee,
    });

    const createdAbsence = await absenceRepository.save({
      ...absence,
      data: new Date('2025-01-30T00:00:00.000Z'),
      funcionario: createdEmployee,
    });

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/faltas/${createdAbsence.id}`)
      .send({
        data: absence.data,
      })
      .expect(409);

    expect(response.body).toEqual({
      statusCode: 409,
      message: 'O funcionário já possui uma falta registrada para este dia.',
      error: 'Conflict',
    });
  });

  it('/v1/funcionarios/faltas/:id (PATCH) - Deve retornar um erro ao atualizar uma falta com tipo de dado inválido', async () => {
    const absenceRepository = dataSource.getRepository(Absence);
    const createdAbsence = await absenceRepository.save({
      ...absence,
      funcionario: createdEmployee,
    });

    const updateData = {
      data: 123,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/funcionarios/faltas/${createdAbsence.id}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining(['data must be a valid ISO 8601 date string']),
    );
  });

  it('/v1/funcionarios/faltas/:id (PATCH) - Deve retornar erro ao atualizar uma falta com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/funcionarios/faltas/abc')
      .send({
        data: '2025-02-11',
      })
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/faltas/:id (PATCH) - Deve retornar erro ao atualizar uma falta inexistente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/funcionarios/faltas/86f226c4-38b0-464c-987e-35293033faf6')
      .send({
        data: '2025-02-11',
      })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Falta não encontrada.',
      error: 'Not Found',
    });
  });

  it('/v1/funcionarios/faltas/:id (DELETE) - Deve excluir uma falta', async () => {
    const absenceRepository = dataSource.getRepository(Absence);
    const createdAbsence = await absenceRepository.save({
      ...absence,
      funcionario: createdEmployee,
    });

    const response = await request(app.getHttpServer())
      .delete(`/v1/funcionarios/faltas/${createdAbsence.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        id: createdAbsence.id,
        motivo: createdAbsence.motivo,
        atualizadoPor: createdUser.nome,
        status: 'E',
      },
      message: `Falta id: #${createdAbsence.id} excluída com sucesso.`,
    });
  });

  it('/v1/funcionarios/faltas/:id (DELETE) - Deve retornar erro ao excluir uma falta com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/funcionarios/faltas/abc')
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/funcionarios/faltas/:id (DELETE) - Deve retornar erro ao excluir uma falta inexistente', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/funcionarios/faltas/86f226c4-38b0-464c-987e-35293033faf6')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Falta já excluída ou não encontrada.',
      error: 'Not Found',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
