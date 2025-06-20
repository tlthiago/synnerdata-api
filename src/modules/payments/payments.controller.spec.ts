import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { User } from '../users/entities/user.entity';
import { PaymentIntent } from './entities/payment.entity';
import { PaymentsModule } from './payments.module';
import { ConfigModule } from '@nestjs/config';
import { Absence } from '../absence/entities/absence.entity';
import { Accident } from '../accidents/entities/accident.entity';
import { Branch } from '../branches/entities/branch.entity';
import { Cbo } from '../cbos/entities/cbo.entity';
import { CostCenter } from '../cost-centers/entities/cost-center.entity';
import { CpfAnalysis } from '../cpf-analysis/entities/cpf-analysis.entity';
import { Department } from '../departments/entities/department.entity';
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

describe('PaymentsController (E2E)', () => {
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
          entities: [
            PaymentIntent,
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
        PaymentsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          id: 'pagarme_mock_id',
          url: 'https://link-pagamento',
        }),
      } as any),
    );

    dataSource = app.get(DataSource);
  }, 50000);

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.query('DELETE FROM "intencoes_de_pagamento" CASCADE;');
    }
  });

  it('/v1/payments/generate-link (POST) - Deve obter um link de pagamento', async () => {
    const dto = {
      nomeFantasia: 'XYZ LTDA',
      razaoSocial: 'XYZ',
      cnpj: '13576276000164',
      email: 'contato@xyz.com',
      telefone: '(31) 0000-0000',
      celular: '(31) 00000-0000',
      tipoPlano: 'Ouro Insights',
      quantidadeFuncionarios: '0-50',
      preco: 200,
    };

    const response = await request(app.getHttpServer())
      .post(`/v1/payments/generate-link`)
      .send(dto)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      url: expect.any(String),
    });

    const paymentIntentRepository = dataSource.getRepository(PaymentIntent);
    const createdPaymentIntent = await paymentIntentRepository.findOneBy({
      pagarmeId: 'pagarme_mock_id',
    });

    expect(createdPaymentIntent).toBeDefined();
    expect(createdPaymentIntent?.razaoSocial).toBe(dto.razaoSocial);
    expect(createdPaymentIntent?.status).toBe('pending');
  });

  it('/v1/payments/generate-link (POST) - Deve retornar 400 se o CNPJ for inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/payments/generate-link`)
      .send({
        nomeFantasia: 'XYZ LTDA',
        razaoSocial: 'XYZ',
        cnpj: '123',
        email: 'contato@xyz.com',
        telefone: '(31) 0000-0000',
        celular: '(31) 00000-0000',
        tipoPlano: 'Ouro Insights',
        quantidadeFuncionarios: '0-50',
        preco: 200,
      })
      .expect(400);

    expect(response.body.message).toContain(
      'cnpj must be longer than or equal to 14 characters',
    );
  });

  it('/v1/payments/generate-link (POST) - Deve retornar 400 se o tipoPlano for inválido', async () => {
    const response = await request(app.getHttpServer())
      .post(`/v1/payments/generate-link`)
      .send({
        nomeFantasia: 'XYZ LTDA',
        razaoSocial: 'XYZ',
        cnpj: '13576276000164',
        email: 'contato@xyz.com',
        telefone: '(31) 0000-0000',
        celular: '(31) 00000-0000',
        tipoPlano: 'Plano Premium',
        quantidadeFuncionarios: '0-50',
        preco: 200,
      })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'tipoPlano must be one of the following values: Ouro Insights, Platina Vision, Diamante Analytics',
      ]),
    );
  });

  afterAll(async () => {
    await app.close();
    await pgContainer.stop();
  });
});
