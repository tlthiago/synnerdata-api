import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { WebhookSubscriptionCreatedDto } from './dto/handle-webhook.dto';

@Controller('v1/payments/webhook')
export class PaymentsWebhookController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(@Body() body: WebhookSubscriptionCreatedDto) {
    await this.paymentsService.handleWebhook(body);
    return { received: true };
  }
}
