import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentIntent } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentIntentDto } from './dto/create-payment-link.dto';
import { WebhookSubscriptionCreatedDto } from './dto/handle-webhook.dto';
import { MailService } from '../services/mail/mail.service';

@Injectable()
export class PaymentsService {
  private readonly secretKey = process.env.PAGARME_SECRET_KEY;
  private readonly baseUrl = process.env.PAGARME_LINK_BASE_URL;

  constructor(
    @InjectRepository(PaymentIntent)
    private readonly paymentRepository: Repository<PaymentIntent>,
    private readonly mailService: MailService,
  ) {}

  private getAuthHeaders() {
    const credentials = `${this.secretKey}:`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    return {
      Authorization: `Basic ${encodedCredentials}`,
      'Content-Type': 'application/json',
    };
  }

  async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto) {
    const pagarmeResponse = await fetch(`${this.baseUrl}/paymentlinks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        is_building: false,
        type: 'subscription',
        payment_settings: {
          accepted_payment_methods: ['CREDIT_CARD'],
          credit_card_settings: {
            operation_type: 'auth_and_capture',
            installments: [],
          },
        },
        cart_settings: {
          items: [],
          recurrences: [
            {
              plan: {
                name: createPaymentIntentDto.tipoPlano,
                payment_methods: ['credit_card'],
                interval: 'month',
                interval_count: 1,
                billing_type: 'prepaid',
                items: [
                  {
                    name: createPaymentIntentDto.tipoPlano,
                    quantity: 1,
                    pricing_scheme: {
                      price: createPaymentIntentDto.preco * 100,
                    },
                  },
                ],
              },
            },
          ],
        },
      }),
    });

    const result = await pagarmeResponse.json();

    if (!pagarmeResponse.ok) {
      throw new BadRequestException(
        `Ocorreu um erro ao gerar o link de pagamento: ${result.message}`,
      );
    }

    const paymentIntent = this.paymentRepository.create({
      ...createPaymentIntentDto,
      pagarmeId: result.id,
    });
    await this.paymentRepository.save(paymentIntent);

    return result;
  }

  async handleWebhook(body: WebhookSubscriptionCreatedDto) {
    const { type, data } = body;

    if (type === 'subscription.created') {
      const pagarmeId = data.code;

      const payment = await this.paymentRepository.findOne({
        where: { pagarmeId },
      });

      if (!payment) {
        throw new Error(
          `Pagamento não encontrado para pagarmeId: ${pagarmeId}`,
        );
      }

      if (payment.status !== 'paid') {
        payment.status = 'paid';
        await this.paymentRepository.save(payment);

        await this.mailService.sendActivationAccountEmail({
          email: payment.email,
        });
      }
    }
  }
}
