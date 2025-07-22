import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { StatusModule } from './status.module';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

describe('StatusController (e2e) - TestContainers', () => {
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
          synchronize: false,
        }),
        StatusModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
  }, 50000);

  beforeEach(async () => {
    if (dataSource.isInitialized) {
      const entities = dataSource.entityMetadatas;
      for (const entity of entities) {
        const repository = dataSource.getRepository(entity.name);
        await repository.clear();
      }
    }
  });

  it('should return API status', async () => {
    const response = await request(app.getHttpServer()).get('/status');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'API-SYNNERDATA');
    expect(response.body).toHaveProperty('status', 'online');
    expect(response.body.dependencies.database).toHaveProperty('version');
    expect(response.body.dependencies.database).toHaveProperty(
      'max_connections',
    );
    expect(response.body.dependencies.database).toHaveProperty(
      'opened_connections',
    );
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await pgContainer.stop();
  });
});
