import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { MockAuthGuard } from '../../common/guards/mock-auth.guard';
import { Company } from '../companies/entities/company.entity';
import { Branch } from '../branches/entities/branch.entity';
import { Department } from '../departments/entities/department.entity';
import { CostCenter } from '../cost-centers/entities/cost-center.entity';
import { Cbo } from '../cbos/entities/cbo.entity';
import { Epi } from '../epis/entities/epi.entity';
import { Role } from '../roles/entities/role.entity';
import { Project } from '../projects/entities/project.entity';
import { Employee } from './entities/employee.entity';
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
import { EmployeesModule } from './employees.module';
import {
  Escala,
  EstadoCivil,
  GrauInstrucao,
  RegimeContratacao,
  Sexo,
} from './enums/employees.enum';
import { MockUserInterceptor } from '../../common/interceptors/mock-user.interceptor';
import * as os from 'os';
import { Workbook } from 'exceljs';

describe('FuncionárioController (E2E)', () => {
  const EMPLOYEE_IMPORT_HEADER = [
    'nome',
    'carteiraidentidade',
    'cpf',
    'sexo',
    'datanascimento',
    'estadocivil',
    'naturalidade',
    'nacionalidade',
    'altura',
    'peso',
    'nomepai',
    'nomemae',
    'email',
    'pis',
    'ctpsnumero',
    'ctpsserie',
    'certificadoreservista',
    'regimecontratacao',
    'dataadmissao',
    'salario',
    'funcao',
    'setor',
    'grauinstrucao',
    'necessidadesespeciais',
    'filhos',
    'celular',
    'gestor',
    'cbo',
    'rua',
    'numero',
    'bairro',
    'cidade',
    'estado',
    'cep',
    'quantidadeonibus',
    'cargahoraria',
    'escala',
    'valoralimentacao',
    'valortransporte',
  ];
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let mockUserInterceptor: MockUserInterceptor;
  let createdUser: User;
  let createdCompany: Company;
  let createdRole: Role;
  let createdDepartment: Department;
  let createdCbo: Cbo;

  const employee = {
    nome: 'Funcionário Teste',
    carteiraIdentidade: 'MG-18.821.128',
    cpf: '64693184799',
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
    funcao: '1',
    setor: '1',
    dataExameAdmissional: '2025-01-01',
    grauInstrucao: GrauInstrucao.SUPERIOR,
    necessidadesEspeciais: false,
    filhos: false,
    celular: '31991897926',
    gestor: 'Gestor Teste',
    cbo: '1',
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
        EmployeesModule,
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
    const roleRepository = dataSource.getRepository(Role);
    const departmentRepository = dataSource.getRepository(Department);
    const cboRepository = dataSource.getRepository(Cbo);

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
      criadoPor: user,
    });
    createdRole = await roleRepository.save(role);

    const department = departmentRepository.create({
      nome: 'Setor Teste',
      criadoPor: user,
    });
    createdDepartment = await departmentRepository.save(department);

    const cbo = cboRepository.create({
      nome: 'Cbo Teste',
      criadoPor: user,
    });
    createdCbo = await cboRepository.save(cbo);

    employee.funcao = createdRole.id;
    employee.setor = createdDepartment.id;
    employee.cbo = createdCbo.id;
  }, 50000);

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.query('DELETE FROM "funcionarios" CASCADE;');
    }
  });

  describe('Importação de funcionários via planilha (E2E)', () => {
    it('deve retornar erro ao importar planilha com cabeçalho errado ou faltando', async () => {
      const header = ['nome', 'cpf', 'sexo'];
      const row = ['Funcionário Teste', '64693184799', 'MASCULINO'];
      const filePath = await createTempXlsx([header, row]);
      const empresaId = createdCompany.id;
      const response = await request(app.getHttpServer())
        .post(`/v1/empresas/${empresaId}/funcionarios/importar`)
        .attach('file', filePath)
        .expect(400);
      expect(response.body.message).toMatch(/Cabeçalho obrigatório/);
    });

    it('deve retornar erro ao importar planilha com campos fora do range', async () => {
      const header = EMPLOYEE_IMPORT_HEADER;
      const row = [
        'A',
        '18821129',
        '64693184799',
        'MASCULINO',
        '15/10/1996',
        'SOLTEIRO',
        'Belo Horizonte',
        'Brasileiro',
        0.1,
        1000,
        'Nome do Pai',
        'Nome da Mãe',
        'email@teste.com.br',
        '12345678910',
        '1234567',
        '1234',
        '12345678910203',
        'CLT',
        '12/02/2025',
        -1,
        createdRole.id,
        createdDepartment.id,
        'SUPERIOR',
        false,
        false,
        '31991897926',
        'Gestor Teste',
        createdCbo.id,
        'Rua Teste',
        '1000',
        'Bela Vista',
        'São Paulo',
        'SP',
        '01000000',
        -1,
        0,
        'SEIS_UM',
        -100,
        -50,
      ];
      const filePath = await createTempXlsx([header, row]);
      const empresaId = createdCompany.id;
      const response = await request(app.getHttpServer())
        .post(`/v1/empresas/${empresaId}/funcionarios/importar`)
        .attach('file', filePath)
        .expect(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'altura',
            message: expect.stringContaining('Altura deve ser no mínimo 0.5'),
          }),
          expect.objectContaining({
            field: 'peso',
            message: expect.stringContaining('Peso deve ser no máximo 500'),
          }),
          expect.objectContaining({
            field: 'salario',
            message: expect.stringContaining('Salário deve ser maior que zero'),
          }),
          expect.objectContaining({
            field: 'quantidadeonibus',
            message: expect.stringContaining(
              'Quantidade de ônibus deve ser maior ou igual a zero',
            ),
          }),
          expect.objectContaining({
            field: 'cargahoraria',
            message: expect.stringContaining(
              'Carga horária deve ser maior que zero',
            ),
          }),
          expect.objectContaining({
            field: 'valoralimentacao',
            message: expect.stringContaining(
              'Valor alimentação deve ser maior ou igual a zero',
            ),
          }),
          expect.objectContaining({
            field: 'valortransporte',
            message: expect.stringContaining(
              'Valor transporte deve ser maior ou igual a zero',
            ),
          }),
        ]),
      );
    });

    it('deve retornar erro ao importar planilha com SQL injection/caracteres especiais', async () => {
      const header = EMPLOYEE_IMPORT_HEADER;
      const row = [
        "Robert'); DROP TABLE funcionarios;--",
        '18821129',
        '64693184799',
        'MASCULINO',
        '15/10/1996',
        'SOLTEIRO',
        'Belo Horizonte',
        'Brasileiro',
        1.73,
        73.3,
        'Nome do Pai',
        'Nome da Mãe',
        'email@teste.com.br',
        '12345678910',
        '1234567',
        '1234',
        '12345678910203',
        'CLT',
        '12/02/2025',
        3799,
        createdRole.id,
        createdDepartment.id,
        'SUPERIOR',
        false,
        false,
        '31991897926',
        'Gestor Teste',
        createdCbo.id,
        'Rua Teste',
        '1000',
        'Bela Vista',
        'São Paulo',
        'SP',
        '01000000',
        1,
        60,
        'SEIS_UM',
        800,
        500,
      ];
      const filePath = await createTempXlsx([header, row]);
      const empresaId = createdCompany.id;
      const response = await request(app.getHttpServer())
        .post(`/v1/empresas/${empresaId}/funcionarios/importar`)
        .attach('file', filePath)
        .expect(201);
      expect(response.body.inserted).toBeGreaterThan(0);
    });

    it('deve retornar múltiplos erros na mesma linha', async () => {
      const header = EMPLOYEE_IMPORT_HEADER;
      const row = [
        '',
        '',
        '123',
        'TESTE',
        '01/01/1990',
        'ERRADO',
        '',
        '',
        'abc',
        'xyz',
        '',
        '',
        'emailinvalido',
        '123',
        '',
        '',
        '',
        'PJ',
        '2022-13-01',
        -100,
        '',
        '',
        'ERRADO',
        'talvez',
        '123',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ];
      const filePath = await createTempXlsx([header, row]);
      const empresaId = createdCompany.id;
      const response = await request(app.getHttpServer())
        .post(`/v1/empresas/${empresaId}/funcionarios/importar`)
        .attach('file', filePath)
        .expect(400);
      expect(response.body.errors.length).toBeGreaterThan(5);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'nome',
            message: expect.stringContaining('Nome é obrigatório'),
          }),
          expect.objectContaining({
            field: 'cpf',
            message: expect.stringContaining(
              'CPF deve conter exatamente 11 dígitos',
            ),
          }),
          expect.objectContaining({
            field: 'sexo',
            message: expect.stringContaining(
              'Sexo deve ser MASCULINO, FEMININO, NAO_DECLARADO ou OUTRO',
            ),
          }),
          expect.objectContaining({
            field: 'email',
            message: expect.stringContaining(
              'Email deve ser um endereço válido',
            ),
          }),
          expect.objectContaining({
            field: 'salario',
            message: expect.stringContaining('Salário deve ser maior que zero'),
          }),
        ]),
      );
    });
    it('deve retornar erro ao importar planilha com tipo de dado inválido', async () => {
      const header = EMPLOYEE_IMPORT_HEADER;
      const row = [
        123,
        '18821129',
        '64693184799',
        'MASCULINO',
        '15/10/1996',
        'SOLTEIRO',
        'Belo Horizonte',
        'Brasileiro',
        1.73,
        73.3,
        'Nome do Pai',
        'Nome da Mãe',
        'email@teste.com.br',
        '12345678910',
        '1234567',
        '1234',
        '12345678910203',
        'CLT',
        '12/02/2025',
        3799,
        'uuid',
        'uuid',
        'SUPERIOR',
        false,
        false,
        '31991897926',
        'Gestor Teste',
        'uuid',
        'Rua Teste',
        '1000',
        'Bela Vista',
        'São Paulo',
        'SP',
        '01000000',
        1,
        60,
        'SEIS_UM',
        800,
        500,
      ];
      const filePath = await createTempXlsx([header, row]);
      const empresaId = createdCompany.id;
      const response = await request(app.getHttpServer())
        .post(`/v1/empresas/${empresaId}/funcionarios/importar`)
        .attach('file', filePath)
        .expect(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            row: 2,
            field: 'nome',
            message: expect.stringContaining(
              'O campo nome deve ser do tipo texto',
            ),
          }),
        ]),
      );
    });

    it('deve retornar erro ao importar planilha com valor de enum inválido', async () => {
      const header = EMPLOYEE_IMPORT_HEADER;
      const row = [
        'Funcionário Teste',
        '18821129',
        '64693184799',
        'INVALIDO',
        '15/10/1996',
        'SOLTEIRO',
        'Belo Horizonte',
        'Brasileiro',
        1.73,
        73.3,
        'Nome do Pai',
        'Nome da Mãe',
        'email@teste.com.br',
        '12345678910',
        '1234567',
        '1234',
        '12345678910203',
        'CLT',
        '12/02/2025',
        3799,
        'uuid',
        'uuid',
        'SUPERIOR',
        false,
        false,
        '31991897926',
        'Gestor Teste',
        'uuid',
        'Rua Teste',
        '1000',
        'Bela Vista',
        'São Paulo',
        'SP',
        '01000000',
        1,
        60,
        'SEIS_UM',
        800,
        500,
      ];
      const filePath = await createTempXlsx([header, row]);
      const empresaId = createdCompany.id;
      const response = await request(app.getHttpServer())
        .post(`/v1/empresas/${empresaId}/funcionarios/importar`)
        .attach('file', filePath)
        .expect(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            row: 2,
            field: 'sexo',
            message: expect.stringContaining(
              'Sexo deve ser MASCULINO, FEMININO, NAO_DECLARADO ou OUTRO',
            ),
          }),
        ]),
      );
    });

    it('deve retornar erro ao importar planilha com data inválida', async () => {
      const header = EMPLOYEE_IMPORT_HEADER;
      const row = [
        'Funcionário Teste',
        '18821129',
        '64693184799',
        'MASCULINO',
        '31/02/1996',
        'SOLTEIRO',
        'Belo Horizonte',
        'Brasileiro',
        1.73,
        73.3,
        'Nome do Pai',
        'Nome da Mãe',
        'email@teste.com.br',
        '12345678910',
        '1234567',
        '1234',
        '12345678910203',
        'CLT',
        '12/02/2025',
        3799,
        'uuid',
        'uuid',
        'SUPERIOR',
        false,
        false,
        '31991897926',
        'Gestor Teste',
        'uuid',
        'Rua Teste',
        '1000',
        'Bela Vista',
        'São Paulo',
        'SP',
        '01000000',
        1,
        60,
        'SEIS_UM',
        800,
        500,
      ];
      const filePath = await createTempXlsx([header, row]);
      const empresaId = createdCompany.id;
      const response = await request(app.getHttpServer())
        .post(`/v1/empresas/${empresaId}/funcionarios/importar`)
        .attach('file', filePath)
        .expect(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            row: 2,
            field: 'datanascimento',
            message: expect.stringContaining(
              'Data de nascimento deve estar no formato DD/MM/YYYY ou YYYY-MM-DD e ser uma data válida',
            ),
          }),
        ]),
      );
    });

    it('deve retornar erro ao importar planilha com CPF duplicado', async () => {
      const header = EMPLOYEE_IMPORT_HEADER;
      const row = [
        'Funcionário Teste',
        '18821129',
        '64693184799',
        'MASCULINO',
        '15/10/1996',
        'SOLTEIRO',
        'Belo Horizonte',
        'Brasileiro',
        1.73,
        73.3,
        'Nome do Pai',
        'Nome da Mãe',
        'email@teste.com.br',
        '12345678910',
        '1234567',
        '1234',
        '12345678910203',
        'CLT',
        '12/02/2025',
        3799,
        createdRole.id,
        createdDepartment.id,
        'SUPERIOR',
        false,
        false,
        '31991897926',
        'Gestor Teste',
        createdCbo.id,
        'Rua Teste',
        '1000',
        'Bela Vista',
        'São Paulo',
        'SP',
        '01000000',
        1,
        60,
        'SEIS_UM',
        800,
        500,
      ];
      const filePath1 = await createTempXlsx([header, row]);
      const empresaId = createdCompany.id;
      await request(app.getHttpServer())
        .post(`/v1/empresas/${empresaId}/funcionarios/importar`)
        .attach('file', filePath1)
        .expect(201);

      const filePath2 = await createTempXlsx([header, row]);
      const response = await request(app.getHttpServer())
        .post(`/v1/empresas/${empresaId}/funcionarios/importar`)
        .attach('file', filePath2)
        .expect(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            row: 2,
            field: 'cpf',
            message: expect.stringContaining('CPF já cadastrado'),
          }),
        ]),
      );
    });
    async function createTempXlsx(rows: any[][]): Promise<string> {
      const workbook = new Workbook();
      const sheet = workbook.addWorksheet('Funcionarios');
      rows.forEach((row) => sheet.addRow(row));
      const tmpFile = path.join(os.tmpdir(), `funcionarios-${Date.now()}.xlsx`);
      return workbook.xlsx.writeFile(tmpFile).then(() => tmpFile);
    }

    afterEach(async () => {
      const tempFiles = fs
        .readdirSync(os.tmpdir())
        .filter((f) => f.startsWith('funcionarios-') && f.endsWith('.xlsx'));
      for (const file of tempFiles) {
        try {
          fs.unlinkSync(path.join(os.tmpdir(), file));
        } catch {}
      }
    });

    it('deve importar uma planilha válida e retornar sucesso', async () => {
      const header = EMPLOYEE_IMPORT_HEADER;
      const row = [
        'Funcionário Teste',
        '18821129',
        '64693184799',
        'MASCULINO',
        '15/10/1996',
        'SOLTEIRO',
        'Belo Horizonte',
        'Brasileiro',
        1.73,
        73.3,
        'Nome do Pai',
        'Nome da Mãe',
        'email@teste.com.br',
        '12345678910',
        '1234567',
        '1234',
        '12345678910203',
        'CLT',
        '12/02/2025',
        3799,
        createdRole.id,
        createdDepartment.id,
        'SUPERIOR',
        false,
        false,
        '31991897926',
        'Gestor Teste',
        createdCbo.id,
        'Rua Teste',
        '1000',
        'Bela Vista',
        'São Paulo',
        'SP',
        '01000000',
        1,
        60,
        'SEIS_UM',
        800,
        500,
      ];
      const filePath = await createTempXlsx([header, row]);
      const empresaId = createdCompany.id;
      const response = await request(app.getHttpServer())
        .post(`/v1/empresas/${empresaId}/funcionarios/importar`)
        .attach('file', filePath)
        .expect(201);

      expect(response.body).toHaveProperty('totalRows');
      expect(response.body).toHaveProperty('inserted');
      expect(response.body).toHaveProperty('skipped');
      expect(response.body.inserted).toBeGreaterThan(0);
    });

    it('deve retornar erro ao importar planilha inválida', async () => {
      const header = EMPLOYEE_IMPORT_HEADER;
      const row = [
        '',
        '',
        '123',
        'TESTE',
        '01/01/1990',
        'ERRADO',
        '',
        '',
        'abc',
        'xyz',
        '',
        '',
        'emailinvalido',
        '123',
        '',
        '',
        '',
        'PJ',
        '2022-13-01',
        -100,
        '',
        '',
        'ERRADO',
        'talvez',
        '123',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ];
      const filePath = await createTempXlsx([header, row]);
      const empresaId = createdCompany.id;
      const response = await request(app.getHttpServer())
        .post(`/v1/empresas/${empresaId}/funcionarios/importar`)
        .attach('file', filePath)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
      expect(response.body.errors.length).toBeGreaterThan(0);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            row: 2,
            field: 'nome',
            message: expect.stringContaining('Nome é obrigatório'),
          }),
          expect.objectContaining({
            row: 2,
            field: 'nome',
            message: expect.stringContaining(
              'Nome deve ter entre 1 e 255 caracteres',
            ),
          }),
        ]),
      );
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
