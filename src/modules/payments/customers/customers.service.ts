import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
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

  async create(createCustomerDto: CreateCustomerDto) {
    const response = await fetch(`${this.baseUrl}/customers`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(createCustomerDto),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new BadRequestException(
        `Ocorreu um erro ao cadastrar um cliente: ${data.message}`,
      );
    }

    return data;
  }

  async findAll() {
    const response = await fetch(`${this.baseUrl}/customers`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new BadRequestException(
        `Ocorreu um erro ao buscar os clientes: ${data.message}`,
      );
    }

    return data;
  }

  async findOne(id: string) {
    const response = await fetch(`${this.baseUrl}/customers/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new BadRequestException(
        `Ocorreu um erro ao buscar o cliente, ${id}: ${data.message}`,
      );
    }

    return data;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const response = await fetch(`${this.baseUrl}/customers/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        ...updateCustomerDto,
        customer_id: id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new BadRequestException(
        `Ocorreu um erro ao atualizar os dados do cliente, ${id}: ${data.message}`,
      );
    }

    return data;
  }
}
