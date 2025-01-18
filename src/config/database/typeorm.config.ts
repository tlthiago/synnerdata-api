import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

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
  entities: ['./src/config/database/entities/**/*.ts'],
  migrations: ['./src/config/database/migrations/**/*.ts'],
  migrationsRun: false,
  logging: true,
});

export default dataSourceOptions;
