import { Module } from '@nestjs/common';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [SubscriptionsModule, CustomersModule],
})
export class PaymentsModule {}
