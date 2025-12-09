import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { config } from 'dotenv';
import * as path from 'path';

// Carrega variáveis de ambiente
const envFile =
  process.env.NODE_ENV === 'development'
    ? '.env.development.local'
    : '.env.prod';

config({ path: envFile });

// Importa factories
import './factories/user.factory';
import './factories/company.factory';
import './factories/branch.factory';
import './factories/department.factory';
import './factories/cost-center.factory';
import './factories/cbo.factory';
import './factories/role.factory';
import './factories/epi.factory';
import './factories/project.factory';
import './factories/employee.factory';
import './factories/absence.factory';
import './factories/vacation.factory';
import './factories/medical-certificate.factory';
import './factories/promotion.factory';
import './factories/termination.factory';
import './factories/accident.factory';
import './factories/warning.factory';
import './factories/labor-action.factory';
import './factories/epi-delivery.factory';
import './factories/cpf-analysis.factory';

// Importa seeder
import MainSeeder from './seeds/main.seeder';

async function runSeed() {
  console.log('🚀 Iniciando conexão com o banco de dados...\n');

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    entities: [
      path.join(
        __dirname,
        '..',
        '..',
        'modules',
        '**',
        'entities',
        '*.entity.{ts,js}',
      ),
    ],
    logging: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conexão estabelecida!\n');

    await runSeeders(dataSource, {
      seeds: [MainSeeder],
    });

    console.log('\n✅ Seeds executados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar seeds:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    process.exit(0);
  }
}

runSeed();
