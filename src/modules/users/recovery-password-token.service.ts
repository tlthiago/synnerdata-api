import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { RecoveryPasswordToken } from './entities/recovery-password-token.entity';

@Injectable()
export class RecoveryPasswordTokenService {
  constructor(
    @InjectRepository(RecoveryPasswordToken)
    private readonly recoveryPasswordTokenRepository: Repository<RecoveryPasswordToken>,
  ) {}

  async create(email: string) {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    const createdToken = await this.recoveryPasswordTokenRepository.save({
      email,
      token,
      expiresAt,
    });

    return createdToken.token;
  }

  async findOne(token: string) {
    const activation = await this.recoveryPasswordTokenRepository.findOne({
      where: { token },
    });

    if (!activation || activation.expiresAt < new Date()) {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    return activation;
  }

  async remove(token: string) {
    const result = await this.recoveryPasswordTokenRepository.delete({
      token,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Token não encontrado.');
    }

    return `O token foi excluído com sucesso.`;
  }
}
