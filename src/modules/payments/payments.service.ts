import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentIntent } from './entities/payment.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatePaymentIntentDto } from './dto/create-payment-link.dto';
import { WebhookSubscriptionCreatedDto } from './dto/handle-webhook.dto';
import { MailService } from '../services/mail/mail.service';
import { CompaniesService } from '../companies/companies.service';
import { UsersService } from '../users/users.service';
import { CreateInitialCompanyDto } from '../companies/dto/create-initial-company.dto';

@Injectable()
export class PaymentsService {
  private readonly secretKey = process.env.PAGARME_SECRET_KEY;
  private readonly baseUrl = process.env.PAGARME_LINK_BASE_URL;

  constructor(
    @InjectRepository(PaymentIntent)
    private readonly paymentIntentRepository: Repository<PaymentIntent>,
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly dataSource: DataSource,
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
    const { cnpj, email } = createPaymentIntentDto;

    const existingCompany = await this.companiesService.findByCnpj(cnpj);
    if (existingCompany) {
      throw new BadRequestException(
        'Já existe uma empresa cadastrada com este CNPJ.',
      );
    }

    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException(
        'Já existe um usuário cadastrado com este email.',
      );
    }

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

    const paymentIntent = this.paymentIntentRepository.create({
      ...createPaymentIntentDto,
      pagarmeId: result.id,
    });
    await this.paymentIntentRepository.save(paymentIntent);

    return result;
  }

  async handleWebhook(body: WebhookSubscriptionCreatedDto) {
    const { type, data } = body;

    if (type === 'subscription.created') {
      const pagarmeId = data.code;

      const payment = await this.paymentIntentRepository.findOne({
        where: { pagarmeId },
      });

      if (!payment) {
        throw new NotFoundException(
          `Pagamento não encontrado para pagarmeId: ${pagarmeId}`,
        );
      }

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        if (payment.status === 'paid') {
          return;
        }

        payment.status = 'paid';
        await this.paymentIntentRepository.save(payment);

        const companyData: CreateInitialCompanyDto = {
          nomeFantasia: payment.nomeFantasia,
          razaoSocial: payment.razaoSocial,
          cnpj: payment.cnpj,
          email: payment.email,
          celular: payment.celular,
          quantidadeFuncionarios: parseInt(
            payment.quantidadeFuncionarios.split('-')[1],
          ),
          plano: payment.tipoPlano,
        };

        const company = await this.companiesService.createInitialCompany(
          companyData,
          data.id,
          queryRunner.manager,
        );

        await this.usersService.createInitialUser(
          {
            nome: payment.razaoSocial,
            email: payment.email,
            empresaId: company.id,
          },
          queryRunner.manager,
        );

        await queryRunner.commitTransaction();

        await this.mailService.sendActivationAccountEmail({
          email: payment.email,
        });
      } catch (error) {
        await queryRunner.rollbackTransaction();

        throw error;
      } finally {
        await queryRunner.release();
      }
    }
  }
}
