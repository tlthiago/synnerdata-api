import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as path from 'path';

config({ path: '.env.development.local' });

const configService = new ConfigService();

const dataSourceOptions = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST') || 'localhost',
  port: +configService.get<number>('DB_PORT') || 5432,
  username: configService.get<string>('DB_USERNAME') || 'test',
  password: configService.get<string>('DB_PASSWORD') || 'test',
  database: configService.get<string>('DB_NAME') || 'test_db',
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
  migrations: [path.join(__dirname, 'migrations', '*.ts')],
  // migrationsRun: false,
  logging: false,
});

export default dataSourceOptions;
