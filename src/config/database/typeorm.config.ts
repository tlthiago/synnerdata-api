import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as path from 'path';

config({ path: '.env.development.local' });

const configService = new ConfigService();

const dataSourceOptions = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: +configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
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
  migrationsRun: true,
  logging: false,
});

export default dataSourceOptions;
