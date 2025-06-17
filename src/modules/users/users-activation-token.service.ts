import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActivationToken } from './entities/user-activation-token.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UserActivationTokenService {
  constructor(
    @InjectRepository(UserActivationToken)
    private readonly userActivationTokenRepository: Repository<UserActivationToken>,
  ) {}

  async create(email: string) {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    const createdToken = await this.userActivationTokenRepository.save({
      email,
      token,
      expiresAt,
    });

    return createdToken.token;
  }

  async findOne(token: string) {
    const activation = await this.userActivationTokenRepository.findOne({
      where: { token },
    });

    if (!activation || activation.expiresAt < new Date()) {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    return activation;
  }

  async findOneByEmail(email: string) {
    const activation = await this.userActivationTokenRepository.findOne({
      where: { email },
    });

    if (!activation) {
      throw new BadRequestException('Token não encontrado.');
    }

    return activation.token;
  }

  async remove(token: string) {
    const result = await this.userActivationTokenRepository.delete({
      token,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Token não encontrado.');
    }

    return `O token foi excluído com sucesso.`;
  }
}
