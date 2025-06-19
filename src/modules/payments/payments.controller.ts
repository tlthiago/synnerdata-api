import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto } from './dto/create-payment-link.dto';

@Controller('v1/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('generate-link')
  async createPaymentIntent(
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
  ) {
    const paymentIntent = await this.paymentsService.createPaymentIntent(
      createPaymentIntentDto,
    );

    return { url: paymentIntent.url };
  }
}
