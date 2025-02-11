// import { Test, TestingModule } from '@nestjs/testing';
// import * as request from 'supertest';
// import { INestApplication, ValidationPipe } from '@nestjs/common';
// import {
//   PostgreSqlContainer,
//   StartedPostgreSqlContainer,
// } from '@testcontainers/postgresql';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';
// import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
// import { MockAuthGuard } from '../../common/guards/mock-auth.guard';
// import { Company } from './../companies/entities/company.entity';
// import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';
// import { Branch } from '../branches/entities/branch.entity';
// import { Department } from '../departments/entities/department.entity';
// import { CostCenter } from '../cost-centers/entities/cost-center.entity';
// import { Cbo } from '../../modules/cbos/entities/cbo.entity';
// import { Epi } from '../../modules/epis/entities/epi.entity';
// import { Role } from '../roles/entities/role.entity';
// import { Project } from '../projects/entities/project.entity';
// import { Employee } from '../employees/entities/employee.entity';
// import { Absence } from '../absence/entities/absence.entity';
// import { MedicalCertificate } from '../medical-certificate/entities/medical-certificate.entity';
// import { Promotion } from '../promotion/entities/promotion.entity';
// import { Termination } from '../terminations/entities/termination.entity';
// import { CpfAnalysis } from '../cpf-analysis/entities/cpf-analysis.entity';
// import { Accident } from '../accidents/entities/accident.entity';
// import { Warning } from '../warnings/entities/warning.entity';
// import { LaborAction } from '../labor-actions/entities/labor-action.entity';
// import { EpiDelivery } from '../epi-delivery/entities/epi-delivery.entity';
// import { Vacation } from '../vacations/entities/vacation.entity';
// import { User } from '../users/entities/user.entity';
// import { AbsenceModule } from './absence.module';
// import {
//   GrauInstrucao,
//   RegimeContratacao,
//   Status,
// } from '../employees/dto/create-employee.dto';
// import { UpdateAbsenceDto } from './dto/update-absence.dto';

// describe('faltaController (E2E)', () => {
//   let app: INestApplication;
//   let pgContainer: StartedPostgreSqlContainer;
//   let dataSource: DataSource;
//   let createdUser: User;
//   let createdEmployee: Employee;
//   const absence = {
//     data: '2025-01-29',
//     motivo: 'Motivo Teste',
//     criadoPor: 1,
//   };

//   beforeAll(async () => {
//     pgContainer = await new PostgreSqlContainer().start();

//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [
//         TypeOrmModule.forRoot({
//           type: 'postgres',
//           url: pgContainer.getConnectionUri(),
//           autoLoadEntities: true,
//           synchronize: true,
//           entities: [
//             Company,
//             Branch,
//             Department,
//             CostCenter,
//             Cbo,
//             Epi,
//             Role,
//             Project,
//             Employee,
//             Absence,
//             MedicalCertificate,
//             Promotion,
//             Termination,
//             CpfAnalysis,
//             Accident,
//             Warning,
//             LaborAction,
//             EpiDelivery,
//             Vacation,
//           ],
//         }),
//         AbsenceModule,
//       ],
//     })
//       .overrideGuard(JwtAuthGuard)
//       .useValue(new MockAuthGuard())
//       .compile();

//     app = moduleFixture.createNestApplication();
//     app.useGlobalPipes(
//       new ValidationPipe({
//         whitelist: true,
//       }),
//     );
//     await app.init();

//     dataSource = app.get(DataSource);

//     const userRepository = dataSource.getRepository(User);
//     const roleRepository = dataSource.getRepository(Role);
//     const departmentRepository = dataSource.getRepository(Department);
//     const companyRepository = dataSource.getRepository(Company);
//     const costCenterRepository = dataSource.getRepository(CostCenter);
//     const employeeRepository = dataSource.getRepository(Employee);

//     const user = userRepository.create({
//       nome: 'Usuário Teste',
//       email: 'teste1@example.com',
//       senha: 'senha123',
//       funcao: 'teste',
//     });
//     createdUser = await userRepository.save(user);

//     const role = roleRepository.create({
//       nome: 'Função Teste',
//       criadoPor: createdUser,
//     });
//     const createdRole = await roleRepository.save(role);

//     const department = departmentRepository.create({
//       nome: 'Departamento Teste',
//       criadoPor: createdUser,
//     });
//     const createdDepartment = await departmentRepository.save(department);

//     const company = companyRepository.create({
//       nomeFantasia: 'Tech Solutions',
//       razaoSocial: 'Tech Solutions LTDA',
//       cnpj: '12345678004175',
//       rua: 'Rua da Tecnologia',
//       numero: '123',
//       complemento: 'Sala 45',
//       bairro: 'Centro',
//       cidade: 'São Paulo',
//       estado: 'SP',
//       cep: '01000-000',
//       dataFundacao: '2010-05-15',
//       telefone: '(11) 99999-9999',
//       faturamento: 1200000.5,
//       regimeTributario: 'Simples Nacional',
//       inscricaoEstadual: '1234567890',
//       cnaePrincipal: '6201500',
//       segmento: 'Tecnologia',
//       ramoAtuacao: 'Desenvolvimento de Software',
//       logoUrl: 'https://example.com/logo.png',
//       status: 'A',
//       criadoPor: createdUser,
//     });
//     const createdCompany = await companyRepository.save(company);

//     const costCenter = costCenterRepository.create({
//       nome: 'Centro de Custo Teste',
//       criadoPor: createdUser,
//     });
//     const createdCostCenter = await costCenterRepository.save(costCenter);

//     const employee = employeeRepository.create({
//       nome: 'Funcionário Teste',
//       status: Status.ATIVO,
//       funcao: createdRole.id,
//       setor: createdDepartment.id,
//       razao: createdCompany.razaoSocial,
//       cnpjContratacao: createdCompany.cnpj,
//       regimeContratacao: RegimeContratacao.CLT,
//       salario: 3700,
//       ctpsSerie: 'CTPS Teste',
//       cpf: '134-201-626.26',
//       vencimentoPrazo1Experiencia: 'Teste',
//       vencimentoPrazo2Experiencia2: 'Teste',
//       centroCusto: createdCostCenter.id,
//       grauInstrucao: GrauInstrucao.SUPERIOR,
//       necessidadesEspeciais: false,
//       sexo: 'Masculino',
//       dataNascimento: '2010-05-15',
//       estadoCivil: 'Solteiro',
//       processoJudicial: false,
//       gestor: 'Gestor Teste',
//       cbo: 'CBO Teste',
//       cep: '31155-290',
//       rua: 'Rua da Tecnologia',
//       numero: '123',
//       complemento: 'Sala 45',
//       bairro: 'Centro',
//       cidade: 'São Paulo',
//       estado: 'SP',
//       criadoPor: createdUser,
//     });
//     createdEmployee = await employeeRepository.save(employee);
//   }, 40000);

//   afterEach(async () => {
//     if (dataSource.isInitialized) {
//       await dataSource.query('DELETE FROM "faltas" CASCADE;');
//     }
//   });

//   it('/v1/funcionarios/:funcionarioId/faltas (POST) - Deve cadastrar uma falta', async () => {
//     const response = await request(app.getHttpServer())
//       .post(`/v1/funcionarios/${createdEmployee.id}/faltas`)
//       .send(absence)
//       .expect(201);

//     expect(response.status).toBe(201);
//     expect(response.body).toEqual({
//       succeeded: true,
//       data: null,
//       message: `Falta cadastrada com sucesso, id: #1.`,
//     });
//   });

//   it('/v1/funcionarios/:funcionarioId/faltas (POST) - Deve retornar erro ao criar uma falta sem informações obrigatórias', async () => {
//     const response = await request(app.getHttpServer())
//       .post(`/v1/funcionarios/${createdEmployee.id}/faltas`)
//       .send({})
//       .expect(400);

//     expect(response.body).toHaveProperty('message');
//     expect(Array.isArray(response.body.message)).toBe(true);
//     expect(response.body.message).toEqual(
//       expect.arrayContaining([
//         'data should not be empty',
//         'criadoPor should not be empty',
//       ]),
//     );
//   });

//   it('/v1/funcionarios/:funcionarioId/faltas (POST) - Deve retornar erro ao criar um falta com tipo de dado inválido', async () => {
//     const response = await request(app.getHttpServer())
//       .post(`/v1/funcionarios/${createdEmployee.id}/faltas`)
//       .send({ ...absence, data: 123 })
//       .expect(400);

//     expect(response.body).toHaveProperty('message');
//     expect(response.body.message).toEqual(
//       expect.arrayContaining(['data must be a string']),
//     );
//   });

//   it('/v1/funcionarios/:funcionarioId/faltas (POST) - Deve retornar erro caso o ID do funcionário não exista', async () => {
//     const response = await request(app.getHttpServer())
//       .post(`/v1/funcionarios/999/faltas`)
//       .send({
//         ...absence,
//         criadoPor: createdUser.id,
//       })
//       .expect(404);

//     expect(response.body).toEqual({
//       statusCode: 404,
//       message: 'Funcionário não encontrado.',
//       error: 'Not Found',
//     });
//   });

//   it('/v1/funcionarios/:funcionarioId/faltas (POST) - Deve retornar erro caso o ID do responsável pela criação não seja um número', async () => {
//     const response = await request(app.getHttpServer())
//       .post(`/v1/funcionarios/${createdEmployee.id}/faltas`)
//       .send({
//         ...absence,
//         criadoPor: 'Teste',
//       })
//       .expect(400);

//     expect(response.body.message).toEqual(
//       expect.arrayContaining([
//         'criadoPor must be a number conforming to the specified constraints',
//       ]),
//     );
//   });

//   it('/v1/funcionarios/:funcionarioId/faltas (POST) - Deve retornar erro caso o ID do responsável pela criação não exista', async () => {
//     const response = await request(app.getHttpServer())
//       .post(`/v1/funcionarios/${createdEmployee.id}/faltas`)
//       .send({
//         ...absence,
//         criadoPor: 999,
//       })
//       .expect(404);

//     expect(response.body).toEqual({
//       statusCode: 404,
//       message: 'Usuário não encontrado.',
//       error: 'Not Found',
//     });
//   });

//   it('/v1/funcionarios/:funcionarioId/faltas (GET) - Deve listar todos os faltas de um funcionário', async () => {
//     const absenceRepository = dataSource.getRepository(Absence);
//     await absenceRepository.save({
//       ...absence,
//       empresa: createdEmployee,
//       criadoPor: createdUser,
//     });

//     const response = await request(app.getHttpServer())
//       .get(`/v1/funcionarios/${createdEmployee.id}/faltas`)
//       .expect(200);

//     expect(response.body).toBeInstanceOf(Array);
//     expect(response.body.length).toBeGreaterThan(0);
//   });

//   it('/v1/funcionarios/faltas/:id (GET) - Deve retonar um falta específica', async () => {
//     const absenceRepository = dataSource.getRepository(Absence);
//     const createdAbsence = await absenceRepository.save({
//       ...absence,
//       funcionario: createdEmployee,
//       criadoPor: createdUser,
//     });

//     const response = await request(app.getHttpServer())
//       .get(`/v1/funcionarios/faltas/${createdAbsence.id}`)
//       .expect(200);

//     expect(response.body).toMatchObject({
//       id: createdAbsence.id,
//       data: createdAbsence.data,
//     });
//   });

//   it('/v1/funcionarios/faltas/:id (GET) - Deve retornar erro ao buscar uma falta inexistente', async () => {
//     const response = await request(app.getHttpServer())
//       .get('/v1/funcionarios/faltas/999')
//       .expect(404);

//     expect(response.body).toEqual({
//       statusCode: 404,
//       message: 'Falta não encontrado.',
//       error: 'Not Found',
//     });
//   });

//   it('/v1/funcionarios/faltas/:id (GET) - Deve retornar erro ao buscar um falta com um ID inválido', async () => {
//     const response = await request(app.getHttpServer())
//       .get('/v1/funcionarios/faltas/abc')
//       .expect(400);

//     expect(response.body).toEqual({
//       statusCode: 400,
//       message: 'Validation failed (numeric string is expected)',
//       error: 'Bad Request',
//     });
//   });

//   it('/v1/funcionarios/faltas/:id (PATCH) - Deve atualizar os dados de uma falta', async () => {
//     const absenceRepository = dataSource.getRepository(Absence);
//     const createdAbsence = await absenceRepository.save({
//       ...absence,
//       funcionario: createdEmployee,
//       criadoPor: createdUser,
//     });

//     const updateData: UpdateAbsenceDto = {
//       data: '2025-02-11',
//       atualizadoPor: createdUser.id,
//     };

//     const response = await request(app.getHttpServer())
//       .patch(`/v1/funcionarios/faltas/${createdAbsence.id}`)
//       .send(updateData)
//       .expect(200);

//     expect(response.body).toMatchObject({
//       succeeded: true,
//       data: {
//         id: expect.any(Number),
//         data: '2025-02-11',
//         atualizadoPor: expect.any(String),
//       },
//       message: `Falta id: #${createdAbsence.id} atualizado com sucesso.`,
//     });

//     const updatedAbsence = await absenceRepository.findOneBy({
//       id: createdAbsence.id,
//     });

//     expect(updatedAbsence.data).toBe(updateData.data);
//   });

//   it('/v1/funcionarios/faltas/:id (PATCH) - Deve retornar um erro ao atualizar uma falta com tipo de dado inválido', async () => {
//     const absenceRepository = dataSource.getRepository(Absence);
//     const createdAbsence = await absenceRepository.save({
//       ...absence,
//       funcionario: createdEmployee,
//       criadoPor: createdUser,
//     });

//     const updateData = {
//       data: 123,
//       atualizadoPor: createdUser.id,
//     };

//     const response = await request(app.getHttpServer())
//       .patch(`/v1/funcionarios/faltas/${createdAbsence.id}`)
//       .send(updateData)
//       .expect(400);

//     expect(response.body).toHaveProperty('message');
//     expect(response.body.message).toEqual(
//       expect.arrayContaining(['data must be a string']),
//     );
//   });

//   it('/v1/funcionarios/faltas/:id (PATCH) - Deve retornar erro ao não informar o ID do responsável pela atualização', async () => {
//     const absenceRepository = dataSource.getRepository(Absence);
//     const createdAbsence = await absenceRepository.save({
//       ...absence,
//       funcionario: createdEmployee,
//       criadoPor: createdUser,
//     });

//     const updateData = {
//       data: '2025-02-11',
//     };

//     const response = await request(app.getHttpServer())
//       .patch(`/v1/funcionarios/faltas/${createdAbsence.id}`)
//       .send(updateData)
//       .expect(400);

//     expect(response.body.message).toEqual(
//       expect.arrayContaining([
//         'O usuário responsável pela atualização deve ser informado.',
//       ]),
//     );
//   });

//   it('/v1/funcionarios/faltas/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não seja um número', async () => {
//     const absenceRepository = dataSource.getRepository(Absence);
//     const createdAbsence = await absenceRepository.save({
//       ...absence,
//       funcionario: createdEmployee,
//       criadoPor: createdUser,
//     });

//     const updateData = {
//       data: '2025-02-11',
//       atualizadoPor: 'Teste',
//     };

//     const response = await request(app.getHttpServer())
//       .patch(`/v1/funcionarios/faltas/${createdAbsence.id}`)
//       .send(updateData)
//       .expect(400);

//     expect(response.body.message).toEqual(
//       expect.arrayContaining([
//         'O identificador do usuário deve ser um número.',
//       ]),
//     );
//   });

//   it('/v1/funcionarios/faltas/:id (PATCH) - Deve retornar erro caso o ID do responsável pela atualização não exista', async () => {
//     const absenceRepository = dataSource.getRepository(Absence);
//     const createdAbsence = await absenceRepository.save({
//       ...absence,
//       empresa: createdEmployee,
//       criadoPor: createdUser,
//     });

//     const updateData = {
//       data: '2025-02-11',
//       atualizadoPor: 999,
//     };

//     const response = await request(app.getHttpServer())
//       .patch(`/v1/funcionarios/faltas/${createdAbsence.id}`)
//       .send(updateData)
//       .expect(404);

//     expect(response.body).toEqual({
//       statusCode: 404,
//       message: 'Usuário não encontrado.',
//       error: 'Not Found',
//     });
//   });

//   it('/v1/funcionarios/faltas/:id (PATCH) - Deve retornar erro ao atualizar uma falta com um ID inválido', async () => {
//     const response = await request(app.getHttpServer())
//       .patch('/v1/funcionarios/faltas/abc')
//       .send({
//         data: '2025-02-11',
//         atualizadoPor: 1,
//       })
//       .expect(400);

//     expect(response.body).toEqual({
//       statusCode: 400,
//       message: 'Validation failed (numeric string is expected)',
//       error: 'Bad Request',
//     });
//   });

//   it('/v1/funcionarios/faltas/:id (PATCH) - Deve retornar erro ao atualizar uma falta inexistente', async () => {
//     const response = await request(app.getHttpServer())
//       .patch('/v1/funcionarios/faltas/9999')
//       .send({
//         data: '2025-02-11',
//         atualizadoPor: 1,
//       })
//       .expect(404);

//     expect(response.body).toEqual({
//       statusCode: 404,
//       message: 'Falta não encontrado.',
//       error: 'Not Found',
//     });
//   });

//   it('/v1/funcionarios/faltas/:id (DELETE) - Deve excluir uma falta', async () => {
//     const absenceRepository = dataSource.getRepository(Absence);
//     const createdAbsence = await absenceRepository.save({
//       ...absence,
//       funcionario: createdEmployee,
//       criadoPor: createdUser,
//     });

//     const deleteAbsenceDto: BaseDeleteDto = {
//       excluidoPor: createdUser.id,
//     };

//     const response = await request(app.getHttpServer())
//       .delete(`/v1/funcionarios/faltas/${createdAbsence.id}`)
//       .send(deleteAbsenceDto)
//       .expect(200);

//     expect(response.body).toEqual({
//       succeeded: true,
//       data: null,
//       message: `Falta id: #${createdAbsence.id} excluída com sucesso.`,
//     });

//     const deletedfalta = await absenceRepository.findOneBy({
//       id: createdAbsence.id,
//     });

//     expect(deletedfalta.status).toBe('E');
//   });

//   it('/v1/funcionarios/faltas/:id (DELETE) - Deve retornar erro ao não informar o ID do responsável pela exclusão', async () => {
//     const response = await request(app.getHttpServer())
//       .delete(`/v1/funcionarios/faltas/1`)
//       .expect(400);

//     expect(response.body.message).toEqual(
//       expect.arrayContaining([
//         'O usuário responsável pela exclusão deve ser informado.',
//       ]),
//     );
//   });

//   it('/v1/funcionarios/faltas/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não seja um número', async () => {
//     const deleteAbsenceDto = {
//       excluidoPor: 'Teste',
//     };

//     const response = await request(app.getHttpServer())
//       .delete(`/v1/funcionarios/faltas/1`)
//       .send(deleteAbsenceDto)
//       .expect(400);

//     expect(response.body.message).toEqual(
//       expect.arrayContaining([
//         'O identificador do usuário deve ser um número.',
//       ]),
//     );
//   });

//   it('/v1/funcionarios/faltas/:id (DELETE) - Deve retornar erro caso o ID do responsável pela exclusão não exista', async () => {
//     const deleteAbsenceDto: BaseDeleteDto = {
//       excluidoPor: 999,
//     };

//     const response = await request(app.getHttpServer())
//       .delete(`/v1/funcionarios/faltas/${createdEmployee.id}`)
//       .send(deleteAbsenceDto)
//       .expect(404);

//     expect(response.body).toEqual({
//       statusCode: 404,
//       message: 'Usuário não encontrado.',
//       error: 'Not Found',
//     });
//   });

//   it('/v1/funcionarios/faltas/:id (DELETE) - Deve retornar erro ao excluir um falta com um ID inválido', async () => {
//     const deleteAbsenceDto: BaseDeleteDto = {
//       excluidoPor: 1,
//     };

//     const response = await request(app.getHttpServer())
//       .delete('/v1/funcionarios/faltas/abc')
//       .send(deleteAbsenceDto)
//       .expect(400);

//     expect(response.body).toEqual({
//       statusCode: 400,
//       message: 'Validation failed (numeric string is expected)',
//       error: 'Bad Request',
//     });
//   });

//   it('/v1/funcionarios/faltas/:id (DELETE) - Deve retornar erro ao excluir um falta inexistente', async () => {
//     const deleteAbsenceDto: BaseDeleteDto = {
//       excluidoPor: createdUser.id,
//     };

//     const response = await request(app.getHttpServer())
//       .delete('/v1/funcionarios/faltas/9999')
//       .send(deleteAbsenceDto)
//       .expect(404);

//     expect(response.body).toEqual({
//       statusCode: 404,
//       message: 'falta não encontrado.',
//       error: 'Not Found',
//     });
//   });

//   afterAll(async () => {
//     await app.close();
//     await pgContainer.stop();
//   });
// });
