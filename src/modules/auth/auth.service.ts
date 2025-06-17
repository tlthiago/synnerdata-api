import {
  BadRequestException,
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
import { CreateSubscriptionDto } from '../payments/subscriptions/dto/create-subscription.dto';
import { SubscriptionsService } from '../payments/subscriptions/subscriptions.service';
import { CompaniesService } from '../companies/companies.service';
import { ActivateAccountDto } from '../users/dto/activate-account.dto';
import { UserActivationTokenService } from '../users/users-activation-token.service';
import { MailService } from '../services/mail/mail.service';
import { DataSource } from 'typeorm';
import { RecoveryPasswordDto } from '../users/dto/recovery-password.dto';
import { RecoveryPasswordTokenService } from '../users/recovery-password-token.service';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';
import { InviteUserDto } from '../users/dto/invite-user-dto';
import { ResendInviteUserDto } from '../users/dto/resend-invite-user-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly companiesService: CompaniesService,
    private readonly userActivationTokenService: UserActivationTokenService,
    private readonly recoveryPasswordTokenService: RecoveryPasswordTokenService,
    private readonly mailService: MailService,
    private readonly dataSource: DataSource,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const { email, senha } = createUserDto;

    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new ConflictException('Já existe um usuário com o mesmo e-mail.');
    }

    const passwordHash = await bcrypt.hash(senha, 6);

    const userData = { ...createUserDto, senha: passwordHash };

    const createdUser = await this.usersService.create(userData);

    return createdUser;
  }

  async subscriptionSignUp(subscriptionSignUpDto: CreateSubscriptionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let subscriptionResponse: any;

    try {
      subscriptionResponse = await this.subscriptionsService.create(
        subscriptionSignUpDto,
      );

      if (
        !subscriptionResponse?.id
        // || subscriptionResponse.status !== 'active'
      ) {
        throw new BadRequestException('Erro ao criar assinatura no Pagar.me');
      }

      const { customer } = subscriptionSignUpDto;

      const companyData = this.extractCompanyDataFromCustomer(customer);

      const company = await this.companiesService.createInitialCompany(
        companyData,
        queryRunner.manager,
      );

      const user = await this.usersService.createInitialUser(
        {
          nome: customer.name,
          email: customer.email,
          empresaId: company.id,
        },
        queryRunner.manager,
      );

      await this.mailService.sendActivationAccountEmail({
        email: user.email,
      });

      await queryRunner.commitTransaction();

      return await this.usersService.findOne(user.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (subscriptionResponse?.id) {
        await this.subscriptionsService.remove(subscriptionResponse.id);
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async inviteUser(companyId: string, inviteUserDto: InviteUserDto) {
    const { email, funcao } = inviteUserDto;

    const company = await this.companiesService.findById(companyId);

    const availableUsers = company.quantidadeUsuarios;

    const currentUsers = await this.usersService.findAllByCompany(company.id);

    if (currentUsers.length === availableUsers) {
      throw new BadRequestException(
        'A organização já possui a quantidade máxima de usuários cadastrados.',
      );
    }

    const user = await this.usersService.createInvitedUser({
      email,
      funcao,
      empresaId: company.id,
    });

    await this.mailService.sendUserInvitationEmail({
      email,
      companyName: company.nomeFantasia,
    });

    return this.usersService.findOne(user.id);
  }

  async resendInviteUser(resendInviteUserDto: ResendInviteUserDto) {
    const { email } = resendInviteUserDto;

    const user = await this.usersService.findOneByEmail(email);

    if (!user || user.status !== 'P') {
      throw new ConflictException('Usuário já aceitou o convite ou inválido.');
    }

    const token = await this.userActivationTokenService.findOneByEmail(email);

    await this.userActivationTokenService.remove(token);

    const company = await this.companiesService.findById(user.empresa);

    await this.mailService.sendUserInvitationEmail({
      email,
      companyName: company.nomeFantasia,
    });

    return this.usersService.findOne(user.id);
  }

  async activateAccount(activateAccountDto: ActivateAccountDto) {
    const { nome, email, senha, activationToken } = activateAccountDto;

    await this.userActivationTokenService.findOne(activationToken);

    const user = await this.usersService.findOneByEmail(email);

    if (!user || user.status !== 'P') {
      throw new ConflictException('Usuário já ativado ou inválido.');
    }

    const passwordHash = await bcrypt.hash(senha, 6);

    await this.usersService.activateUser(user.id, nome, email, passwordHash);
    await this.userActivationTokenService.remove(activationToken);

    return user.id;
  }

  async recoveryPassword(recoveryPasswordDto: RecoveryPasswordDto) {
    const { email } = recoveryPasswordDto;

    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      return;
    }

    const token = await this.recoveryPasswordTokenService.create(user.email);

    await this.mailService.sendRecoveryPasswordEmail({
      email: user.email,
      recoveryToken: token,
    });

    return;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { recoveryToken, novaSenha } = resetPasswordDto;

    const recoveryData =
      await this.recoveryPasswordTokenService.findOne(recoveryToken);

    const user = await this.usersService.findOneByEmail(recoveryData.email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const samePassword = await bcrypt.compare(novaSenha, user.senha);

    if (samePassword) {
      throw new BadRequestException(
        'A nova senha não pode ser igual a anterior.',
      );
    }

    const passwordHash = await bcrypt.hash(novaSenha, 6);

    await this.usersService.updatePassword(user.id, passwordHash);
    await this.recoveryPasswordTokenService.remove(recoveryToken);

    return user.email;
  }

  async signIn(authDto: AuthDto): Promise<SignInResponseDto> {
    const { email, senha } = authDto;

    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuário ou senha inválidos.');
    }

    if (user.status !== 'A') {
      throw new BadRequestException('Usuário não autorizado.');
    }

    const passwordIsValid = await compare(senha, user.senha);

    if (!passwordIsValid) {
      throw new ConflictException('Usuário ou senha inválidos.');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
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

  private extractCompanyDataFromCustomer(
    customer: CreateSubscriptionDto['customer'],
  ) {
    const homePhone = customer.phones.home_phone
      ? customer.phones.home_phone.country_code +
        customer.phones.home_phone.number
      : null;

    const mobilePhone = `${customer.phones.mobile_phone.area_code}${customer.phones.mobile_phone.number}`;

    const [number, street, neighborhood] = customer.address.line_1.split(', ');

    return {
      razaoSocial: customer.name,
      nomeFantasia: customer.metadata.company,
      cnpj: customer.document,
      email: customer.email,
      telefone: homePhone,
      celular: mobilePhone,
      rua: street,
      numero: number,
      bairro: neighborhood,
      complemento: customer.address.line_2,
      cidade: customer.address.city,
      estado: customer.address.country,
      cep: customer.address.zip_code,
    };
  }
}
