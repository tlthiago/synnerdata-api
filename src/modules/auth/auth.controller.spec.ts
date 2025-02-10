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

describe('AuthController (e2e) - Sign-Up', () => {
  let app: INestApplication;
  let pgContainer: StartedPostgreSqlContainer;
  let dataSource: DataSource;

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
        }),
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    dataSource = app.get(DataSource);
  }, 40000);

  afterEach(async () => {
    if (dataSource.isInitialized) {
      const entities = dataSource.entityMetadatas;
      for (const entity of entities) {
        const repository = dataSource.getRepository(entity.name);
        await repository.clear();
      }
    }
  });

  it('should successfully register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-up')
      .send({
        nome: 'John Doe',
        email: 'johndoe@example.com',
        senha: '12345678',
        funcao: 'Teste',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      succeeded: true,
      data: null,
      message: 'Usuário cadastrado com sucesso.',
    });
  });

  it('should return conflict error when email is already registered', async () => {
    const userData = {
      nome: 'Jane Doe',
      email: 'janedoe@example.com',
      senha: 'password123',
      funcao: 'Teste',
    };

    await request(app.getHttpServer()).post('/v1/auth/sign-up').send(userData);

    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-up')
      .send(userData);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      statusCode: 409,
      message: 'Já existe um usuário com o mesmo e-mail.',
      error: 'Conflict',
    });
  });

  it('should successfully authenticate a user', async () => {
    const userRepository = dataSource.getRepository('User');
    const passwordHash = await bcrypt.hash('validpassword', 10);

    const user = userRepository.create({
      nome: 'John Doe',
      email: 'johndoe@example.com',
      senha: passwordHash,
      funcao: 'Teste',
    });

    await userRepository.save(user);

    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-in')
      .send({
        email: 'johndoe@example.com',
        senha: 'validpassword',
      });

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

  it('should return not found error when user does not exist', async () => {
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

  it('should return conflict error when password is incorrect', async () => {
    const userRepository = dataSource.getRepository('User');
    const passwordHash = await bcrypt.hash('correctpassword', 10);

    const user = userRepository.create({
      nome: 'Jane Doe',
      email: 'janedoe@example.com',
      senha: passwordHash,
      funcao: 'Teste',
    });

    await userRepository.save(user);

    const response = await request(app.getHttpServer())
      .post('/v1/auth/sign-in')
      .send({
        email: 'janedoe@example.com',
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
