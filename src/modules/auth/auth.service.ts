import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginResponseDto } from './dto/login-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) throw new NotFoundException('Usuário ou senha inválidos.');

    const passwordIsValid = await compare(password, user.password);

    if (!passwordIsValid)
      throw new ConflictException('Usuário ou senha inválidos.');

    const accessToken = this.jwtService.sign({
      sub: user.id,
    });
    const tokenType = 'Bearer';
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 8);

    return {
      succeeded: true,
      data: {
        access_token: accessToken,
        token_type: tokenType,
        expiration_date: expirationDate.toISOString(),
      },
      message: 'Login realizado com sucesso.',
    };
  }
}
