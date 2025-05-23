import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CompaniesModule } from '../companies/companies.module';
import { UserActivationToken } from './entities/user-activation-token.entity';
import { UserActivationTokenService } from './users-activation-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserActivationToken]),
    CompaniesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserActivationTokenService],
  exports: [UsersService, UserActivationTokenService],
})
export class UsersModule {}
