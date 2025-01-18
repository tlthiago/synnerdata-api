import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { StatusModule } from './status.module';

describe('StatusController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.development.local',
          isGlobal: true,
        }),
        DatabaseModule,
        StatusModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should return API status', async () => {
    const response = await request(app.getHttpServer()).get('/status');

    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
