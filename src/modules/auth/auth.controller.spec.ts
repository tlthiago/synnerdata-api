import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth.module';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Company } from '../companies/entities/company.entity';
import { Funcao, User } from '../users/entities/user.entity';
import { Branch } from '../branches/entities/branch.entity';
import { Department } from '../departments/entities/department.entity';
import { CostCenter } from '../cost-centers/entities/cost-center.entity';
import { Cbo } from '../cbos/entities/cbo.entity';
import { Absence } from '../absence/entities/absence.entity';
import { Accident } from '../accidents/entities/accident.entity';
import { CpfAnalysis } from '../cpf-analysis/entities/cpf-analysis.entity';
import { Employee } from '../employees/entities/employee.entity';
import { EpiDelivery } from '../epi-delivery/entities/epi-delivery.entity';
import { Epi } from '../epis/entities/epi.entity';
import { LaborAction } from '../labor-actions/entities/labor-action.entity';
import { MedicalCertificate } from '../medical-certificate/entities/medical-certificate.entity';
import { Project } from '../projects/entities/project.entity';
import { Promotion } from '../promotion/entities/promotion.entity';
import { Role } from '../roles/entities/role.entity';
import { Termination } from '../terminations/entities/termination.entity';
import { Vacation } from '../vacations/entities/vacation.entity';
import { Warning } from '../warnings/entities/warning.entity';
import { MailService } from '../services/mail/mail.service';
import { SubscriptionsService } from '../payments/subscriptions/subscriptions.service';

describe('AuthController (e2e) - Sign-Up', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;

  const mailServiceMock = {
    sendActivationAccountEmail: jest.fn().mockResolvedValue(undefined),
  };

  const subscriptionServiceMock = {
    create: jest.fn().mockResolvedValue({
      id: 'fake-subscription-id',
      status: 'active',
    }),
    remove: jest.fn().mockResolvedValue({
      id: 'fake-subscription-id',
      status: 'canceled',
    }),
  };

  const user = {
    nome: 'Usuário Teste',
    email: 'teste@example.com',
    senha: '$3nh4F0rt3',
  };

  const companyUser = {
    customer: {
      name: user.nome,
      email: user.email,
      document_type: 'CNPJ',
      document: '22783667000123',
      type: 'company',
      address: {
        line_1: '1765, Rua José Cleto, Santa Cruz',
        line_2: 'Bloco 1, Apto 104',
        zip_code: '31155290',
        city: 'Belo Horizonte',
        state: 'MG',
        country: 'BR',
      },
      phones: {
        home_phone: {
          area_code: '55',
          country_code: '31',
          number: '33704271',
        },
        mobile_phone: {
          country_code: '55',
          area_code: '31',
          number: '991897926',
        },
      },
      metadata: {
        company: 'XYZ',
      },
    },
    items: [
      {
        name: 'Ouro Insights',
        description: 'Ouro Insights',
        quantity: '1',
        pricing_scheme: {
          scheme_type: 'unit',
          price: 1,
        },
      },
    ],
    card_token: 'token_W1mRgd0f3yfZgLor',
    credit_card: {
      card: {
        billing_address: {
          line_1: '1765, Rua José Cleto, Santa Cruz',
          line_2: 'Bloco 1, Apto 104',
          zip_code: '31155290',
          city: 'Belo Horizonte',
          state: 'MG',
          country: 'BR',
        },
      },
    },
  };

  beforeAll(async () => {
    pgContainer = await new PostgreSqlContainer().start();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test.local',
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: pgContainer.getConnectionUri(),
          autoLoadEntities: true,
          synchronize: true,
          entities: [
            Company,
            User,
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
        AuthModule,
      ],
    })
      .overrideProvider(SubscriptionsService)
      .useValue(subscriptionServiceMock)
      .overrideProvider(MailService)
      .useValue(mailServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    dataSource = app.get(DataSource);
  }, 50000);

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.query('DELETE FROM "usuarios" CASCADE;');
    }
  });

  it('/v1/auth/sign-up/admin (POST) - Deve cadastrar um usuário administrador do sistema', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-up/admin')
      .send(user)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        nome: user.nome,
        email: user.email,
        funcao: Funcao.SUPER_ADMIN,
      },
      message: expect.stringContaining('Usuário cadastrado com sucesso, id: #'),
    });
  });

  it('/v1/auth/sign-up/admin (POST) - Deve retornar um erro caso já exista um usuário com o mesmo email', async () => {
    const usersRepository = dataSource.getRepository(User);
    await usersRepository.save({ ...user, funcao: Funcao.SUPER_ADMIN });

    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-up/admin')
      .send(user)
      .expect(409);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      statusCode: 409,
      message: 'Já existe um usuário com o mesmo e-mail.',
      error: 'Conflict',
    });
  });

  it('/v1/auth/sign-up/admin (POST) - Deve retornar um erro caso já exista um usuário com o mesmo email considerando o case diferente', async () => {
    const usersRepository = dataSource.getRepository(User);
    await usersRepository.save({ ...user, funcao: Funcao.SUPER_ADMIN });

    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-up/admin')
      .send({ ...user, email: 'Teste@example.com' })
      .expect(409);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      statusCode: 409,

      message: 'Já existe um usuário com o mesmo e-mail.',
      error: 'Conflict',
    });
  });

  it('/v1/auth/sign-up/admin (POST) - Deve retornar erro ao criar um usuário com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-up/admin')
      .send({ ...user, email: 123 })
      .expect(400);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      statusCode: 400,
      message: ['email must be an email'],
      error: 'Bad Request',
    });
  });

  it('/v1/auth/sign-up/admin (POST) - Deve retornar erro ao criar um usuário com uma senha fraca', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-up/admin')
      .send({ ...user, senha: 123 })
      .expect(400);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      statusCode: 400,
      message: ['senha is not strong enough'],
      error: 'Bad Request',
    });
  });

  it('/v1/auth/sign-up (POST) - Deve cadastrar um usuário administrador da organização', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-up')
      .send(companyUser)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        nome: user.nome,
        email: user.email,
        funcao: Funcao.ADMIN,
      },
      message: expect.stringContaining('Usuário cadastrado com sucesso, id: #'),
    });
  });

  it('/v1/auth/sign-up (POST) - Deve cadastrar um usuário administrador da organização sem telefone', async () => {
    delete companyUser.customer.phones.home_phone;

    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-up')
      .send({
        ...companyUser,
        customer: {
          ...companyUser.customer,
          document: '22783667000126',
          email: 'teste2@example.com',
        },
      })
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      succeeded: true,
      data: {
        nome: user.nome,
        email: 'teste2@example.com',
        funcao: Funcao.ADMIN,
      },
      message: expect.stringContaining('Usuário cadastrado com sucesso, id: #'),
    });
  });

  it('/v1/auth/sign-up (POST) - Deve retornar um erro ao cadastrar um usuário administrador com um CNPJ já existente', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-up')
      .send(companyUser)
      .expect(409);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      statusCode: 409,
      message: 'Já existe uma empresa com o mesmo CNPJ.',
      error: 'Conflict',
    });
  });

  it('/v1/auth/sign-up (POST) - Deve retornar um erro ao cadastrar um usuário administrador com um email já existente', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-up')
      .send({
        ...companyUser,
        customer: { ...companyUser.customer, document: '22783667000124' },
      })
      .expect(409);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      statusCode: 409,
      message: 'Já existe uma empresa com o mesmo email.',
      error: 'Conflict',
    });
  });

  it('/v1/auth/sign-up (POST) - Deve retornar um erro ao cadastrar um usuário administrador com um email já existente considerando o case', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-up')
      .send({
        ...companyUser,
        customer: {
          ...companyUser.customer,
          document: '22783667000125',
          email: 'Teste@example.com',
        },
      })
      .expect(409);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      statusCode: 409,
      message: 'Já existe uma empresa com o mesmo email.',
      error: 'Conflict',
    });
  });

  it('/v1/auth/sign-up (POST) - Deve retornar um erro ao cadastrar um usuário administrador sem informações obrigatórias', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-up')
      .send()
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'items must be an array',
        'card_token must be a string',
      ]),
    );
  });

  it('/v1/auth/sign-in (POST) - Deve autenticar um usuário', async () => {
    const usersRepository = dataSource.getRepository(User);
    const passwordHash = await bcrypt.hash('validpassword', 10);
    await usersRepository.save({
      ...user,
      senha: passwordHash,
      funcao: Funcao.ADMIN,
    });

    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-in')
      .send({
        email: user.email,
        senha: 'validpassword',
      })
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        succeeded: true,
        data: expect.objectContaining({
          access_token: expect.any(String),
          expiration_date: expect.any(String),
          token_type: 'Bearer',
        }),
        message: 'Login realizado com sucesso.',
      }),
    );
  });

  it('/v1/auth/sign-in (POST) - Deve autenticar um usuário mesmo com email considerando o case diferente', async () => {
    const usersRepository = dataSource.getRepository(User);
    const passwordHash = await bcrypt.hash('validpassword', 10);
    await usersRepository.save({
      ...user,
      senha: passwordHash,
      funcao: Funcao.ADMIN,
    });

    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-in')
      .send({
        email: 'TeSte@examplE.com',
        senha: 'validpassword',
      })
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        succeeded: true,
        data: expect.objectContaining({
          access_token: expect.any(String),
          expiration_date: expect.any(String),
          token_type: 'Bearer',
        }),
        message: 'Login realizado com sucesso.',
      }),
    );
  });

  it('/v1/auth/sign-in (POST) - Deve retornar um erro ao tentar autenticar um usuário com tipo de dado inválido', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-in')
      .send({
        email: 123,
        senha: 'validpassword',
      })
      .expect(400);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      statusCode: 400,
      message: ['email must be an email'],
      error: 'Bad Request',
    });
  });

  it('/v1/auth/sign-in (POST) - Deve retornar um erro ao tentar autenticar um usuário inexistente', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-in')
      .send({
        email: 'nonexistent@example.com',
        senha: 'somepassword',
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário ou senha inválidos.',
      error: 'Not Found',
    });
  });

  it('/v1/auth/sign-in (POST) - Deve retornar um erro ao tentar autenticar um usuário com senha incorreta', async () => {
    const usersRepository = dataSource.getRepository(User);
    const passwordHash = await bcrypt.hash('correctpassword', 10);
    await usersRepository.save({
      ...user,
      senha: passwordHash,
      funcao: Funcao.ADMIN,
    });

    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-in')
      .send({
        email: user.email,
        senha: 'wrongpassword',
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      statusCode: 409,
      message: 'Usuário ou senha inválidos.',
      error: 'Conflict',
    });
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
