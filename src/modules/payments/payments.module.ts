import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentsWebhookController } from './payments-webhook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentIntent } from './entities/payment.entity';
import { MailModule } from '../services/mail/mail.module';
import { CompaniesModule } from '../companies/companies.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentIntent]),
    MailModule,
    CompaniesModule,
    UsersModule,
  ],
  controllers: [PaymentsController, PaymentsWebhookController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
