import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

const envFile =
  process.env.NODE_ENV === 'development'
    ? '.env.development.local'
    : '.env.prod';

config({ path: envFile });

const DataSourceOptions = new DataSource({
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
  migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
  migrationsRun: true,
  logging: false,
});

export default DataSourceOptions;
