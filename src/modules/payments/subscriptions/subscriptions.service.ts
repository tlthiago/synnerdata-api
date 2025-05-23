import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  private readonly secretKey = process.env.PAGARME_SECRET_KEY;
  private readonly baseUrl = process.env.PAGARME_BASE_URL;

  private getAuthHeaders() {
    const credentials = `${this.secretKey}:`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    return {
      Authorization: `Basic ${encodedCredentials}`,
      'Content-Type': 'application/json',
    };
  }

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const response = await fetch(`${this.baseUrl}/subscriptions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(createSubscriptionDto),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new BadRequestException(
        `Ocorreu um erro ao cadastrar uma assinatura: ${data.message}`,
      );
    }

    return data;
  }

  async findAll() {
    const response = await fetch(`${this.baseUrl}/subscriptions`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new BadRequestException(
        `Ocorreu um erro ao buscar as assinaturas: ${data.message}`,
      );
    }

    return data;
  }

  async findOne(id: string) {
    const response = await fetch(`${this.baseUrl}/subscriptions/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new BadRequestException(
        `Ocorreu um erro ao buscar a assinatura, ${id}: ${data.message}`,
      );
    }

    return data;
  }

  async remove(id: string) {
    const response = await fetch(`${this.baseUrl}/subscriptions/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new BadRequestException(
        `Ocorreu um erro ao cancelar a assinatura, ${id}: ${data.message}`,
      );
    }

    return data;
  }
}
