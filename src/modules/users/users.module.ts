import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CompaniesModule } from '../companies/companies.module';
import { UserActivationToken } from './entities/user-activation-token.entity';
import { UserActivationTokenService } from './users-activation-token.service';
import { RecoveryPasswordTokenService } from './recovery-password-token.service';
import { RecoveryPasswordToken } from './entities/recovery-password-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserActivationToken,
      RecoveryPasswordToken,
    ]),
    forwardRef(() => CompaniesModule),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserActivationTokenService,
    RecoveryPasswordTokenService,
  ],
  exports: [
    UsersService,
    UserActivationTokenService,
    RecoveryPasswordTokenService,
  ],
})
export class UsersModule {}
