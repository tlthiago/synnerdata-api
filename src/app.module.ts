import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database/database.module';
import { StatusModule } from './modules/status/status.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development.local',
    }),
    DatabaseModule,
    StatusModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
