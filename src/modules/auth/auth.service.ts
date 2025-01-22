import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const { email, senha } = createUserDto;

    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new ConflictException('Já existe um usuário com o mesmo e-mail.');
    }

    const passwordHash = await bcrypt.hash(senha, 6);

    const userData = { ...createUserDto, senha: passwordHash };
    return await this.usersService.create(userData);
  }

  async signIn(authDto: AuthDto): Promise<SignInResponseDto> {
    const { email, senha } = authDto;

    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuário ou senha inválidos.');
    }

    const passwordIsValid = await compare(senha, user.senha);

    if (!passwordIsValid) {
      throw new ConflictException('Usuário ou senha inválidos.');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
    });
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 8);
    const tokenType = 'Bearer';

    return {
      succeeded: true,
      data: {
        access_token: accessToken,
        expiration_date: expirationDate.toISOString(),
        token_type: tokenType,
      },
      message: 'Login realizado com sucesso.',
    };
  }
}
