import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users.module';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { MockAuthGuard } from '../../common/guards/mock-auth.guard';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';

describe('UsersController (E2E)', () => {
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
        }),
        UsersModule,
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
  }, 50000);

  afterEach(async () => {
    if (dataSource.isInitialized) {
      const entities = dataSource.entityMetadatas;
      for (const entity of entities) {
        const repository = dataSource.getRepository(entity.name);
        await repository.clear();
      }
    }
  });

  it('/v1/usuarios (GET) - Deve listar todos os usuários', async () => {
    const userRepository = dataSource.getRepository(User);
    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senha: 'senha123',
      funcao: 'admin',
    });
    await userRepository.save(createdUser);

    const response = await request(app.getHttpServer())
      .get('/v1/usuarios')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/v1/usuarios/:id (GET) - Deve retornar um usuário específico', async () => {
    const userRepository = dataSource.getRepository(User);
    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senha: 'senha123',
      funcao: 'admin',
    });
    await userRepository.save(createdUser);

    const response = await request(app.getHttpServer())
      .get(`/v1/usuarios/${createdUser.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdUser.id,
      nome: createdUser.nome,
      email: createdUser.email,
      funcao: createdUser.funcao,
    });
  });

  it('/v1/usuarios/:id (GET) - Deve retornar um erro ao buscar um usuário inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get(`/v1/usuarios/9999`)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/usuarios/:id (GET) - Deve retornar um erro ao buscar um usuário com um ID inválido', async () => {
    const response = await request(app.getHttpServer())
      .get(`/v1/usuarios/abc`)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/usuarios/:id (PATCH) - Deve atualizar os dados de um usuário', async () => {
    const userRepository = dataSource.getRepository(User);
    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senha: 'senha123',
      funcao: 'admin',
    });
    await userRepository.save(createdUser);

    const updateUserDto: UpdateUserDto = {
      nome: 'Novo Nome',
      atualizadoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/usuarios/${createdUser.id}`)
      .send(updateUserDto)
      .expect(200);

    expect(response.body.succeeded).toBe(true);
    expect(response.body.message).toBe('Usuário atualizado com sucesso.');
  });

  it('/v1/usuarios/:id (PATCH) - Deve retornar erro ao não informar o ID do responsável pela atualização', async () => {
    const userRepository = dataSource.getRepository(User);
    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senha: 'senha123',
      funcao: 'admin',
    });
    await userRepository.save(createdUser);

    const updateUserDto = {
      nome: 'Novo Nome',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/usuarios/${createdUser.id}`)
      .send(updateUserDto)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining(['atualizadoPor should not be empty']),
    );
  });

  it('/v1/usuarios/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não seja um número', async () => {
    const userRepository = dataSource.getRepository(User);
    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senha: 'senha123',
      funcao: 'admin',
    });
    await userRepository.save(createdUser);

    const updateUserDto = {
      nome: 'Novo Nome',
      atualizadoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .patch(`/v1/usuarios/${createdUser.id}`)
      .send(updateUserDto)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'atualizadoPor must be a number conforming to the specified constraints',
      ]),
    );
  });

  it('/v1/usuarios/:id (PATCH) - Deve retornar erro ao atualizar um usuário com um ID inválido', async () => {
    const updateUserDto: UpdateUserDto = {
      nome: 'Novo Nome',
      atualizadoPor: 1,
    };

    const response = await request(app.getHttpServer())
      .patch('/v1/usuarios/abc')
      .send(updateUserDto)
      .expect(400);

    expect(response.body.message).toContain(
      'Validation failed (numeric string is expected)',
    );
  });

  it('/v1/usuarios/:id (PATCH) - Deve retornar erro ao atualizar um usuário com um ID inexistente', async () => {
    const updateUserDto: UpdateUserDto = {
      nome: 'Novo Nome',
      atualizadoPor: 1,
    };

    const response = await request(app.getHttpServer())
      .patch('/v1/usuarios/9999')
      .send(updateUserDto)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Usuário não encontrado.',
      error: 'Not Found',
    });
  });

  it('/v1/usuarios/:id (DELETE) - Deve excluir um usuário', async () => {
    const userRepository = dataSource.getRepository(User);
    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senha: 'senha123',
      funcao: 'admin',
    });
    await userRepository.save(createdUser);

    const deleteUserDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/usuarios/${createdUser.id}`)
      .send(deleteUserDto)
      .expect(200);

    expect(response.body.succeeded).toBe(true);
    expect(response.body.message).toContain(
      `Usuário id: #${createdUser.id} excluído com sucesso.`,
    );
  });

  it('/v1/usuarios/:id (DELETE) - Deve retornar erro ao não informar o ID do responsável pela exclusão', async () => {
    const userRepository = dataSource.getRepository(User);
    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senha: 'senha123',
      funcao: 'admin',
    });
    await userRepository.save(createdUser);

    const response = await request(app.getHttpServer())
      .delete(`/v1/usuarios/${createdUser.id}`)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O usuário responsável pela exclusão deve ser informado.',
      ]),
    );
  });

  it('/v1/usuarios/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não seja um número', async () => {
    const userRepository = dataSource.getRepository(User);
    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senha: 'senha123',
      funcao: 'admin',
    });
    await userRepository.save(createdUser);

    const deleteUserDto = {
      atualizadoPor: 'Teste',
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/usuarios/${createdUser.id}`)
      .send(deleteUserDto)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'O identificador do usuário deve ser um número.',
      ]),
    );
  });

  it('/v1/usuarios/:id (DELETE) - Deve retornar erro ao excluir um usuário com um ID inválido', async () => {
    const userRepository = dataSource.getRepository(User);
    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senha: 'senha123',
      funcao: 'admin',
    });
    await userRepository.save(createdUser);

    const deleteUserDto: BaseDeleteDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/usuarios/abc`)
      .send(deleteUserDto)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed (numeric string is expected)',
      error: 'Bad Request',
    });
  });

  it('/v1/usuarios/:id (DELETE) - Deve retornar erro ao excluir um usuário inexistente', async () => {
    const userRepository = dataSource.getRepository(User);
    const createdUser = userRepository.create({
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senha: 'senha123',
      funcao: 'admin',
    });
    await userRepository.save(createdUser);

    const deleteUserDto = {
      excluidoPor: createdUser.id,
    };

    const response = await request(app.getHttpServer())
      .delete(`/v1/usuarios/9999`)
      .send(deleteUserDto)
      .expect(404);

    expect(response.body.message).toContain('Usuário não encontrado.');
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
