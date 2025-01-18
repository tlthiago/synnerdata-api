import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: +configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USERNAME') || 'test',
        password: configService.get<string>('DB_PASSWORD') || 'test',
        database: configService.get<string>('DB_NAME') || 'test_db',
        synchronize: true,
        // entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        migrations: [__dirname + '/migrations/*.ts'],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
