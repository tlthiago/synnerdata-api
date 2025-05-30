import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateSubscriptionDto } from '../payments/subscriptions/dto/create-subscription.dto';
import { ActivateAccountDto } from '../users/dto/activate-account.dto';
import { RecoveryPasswordDto } from '../users/dto/recovery-password.dto';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';

@Controller('v1/auth')
@ApiTags('Autenticação')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up/admin')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Cadastrar usuário',
    description: 'Endpoint responsável por cadastrar um usuário.',
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar o usuário',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma mensagem de sucesso caso o cadastro seja bem sucedido.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Usuário cadastrado com sucesso.',
        },
      },
    },
  })
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.signUp(createUserDto);

    return {
      succeeded: true,
      data: user,
      message: `Usuário cadastrado com sucesso, id: #${user.id}.`,
    };
  }

  @Post('sign-up')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Cadastrar usuário',
    description: 'Endpoint responsável por cadastrar um usuário.',
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar o usuário',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma mensagem de sucesso caso o cadastro seja bem sucedido.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Usuário cadastrado com sucesso.',
        },
      },
    },
  })
  async subscriptionSignUp(
    @Body() subscriptionSignUpDto: CreateSubscriptionDto,
  ) {
    const createdUser = await this.authService.subscriptionSignUp(
      subscriptionSignUpDto,
    );

    return {
      succeeded: true,
      data: createdUser,
      message: `Usuário cadastrado com sucesso, id: #${createdUser.id}.`,
    };
  }

  @Post('activate-account')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Ativar conta de usuário',
    description: 'Endpoint responsável por ativar a conta de um usuário.',
  })
  @ApiBody({
    description: 'Dados necessários para ativar a conta do usuário',
    type: ActivateAccountDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma mensagem de sucesso caso a ativação seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'A conta do usuário foi ativada com sucesso.',
        },
      },
    },
  })
  async activateAccount(@Body() activateAccountDto: ActivateAccountDto) {
    const userId = await this.authService.activateAccount(activateAccountDto);

    return {
      succeeded: true,
      data: null,
      message: `A conta do usuário #ID: ${userId} foi ativada com sucesso!`,
    };
  }

  @Post('recovery-password')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Recuperar senha',
    description:
      'Endpoint responsável por enviar um email para recuperação de senha.',
  })
  @ApiBody({
    description: 'Dados necessários para recuperar a senha do usuário',
    type: RecoveryPasswordDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma mensagem de sucesso caso a recuperação seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'A conta do usuário foi ativada com sucesso.',
        },
      },
    },
  })
  async recoveryPassword(@Body() recoveryPasswordDto: RecoveryPasswordDto) {
    await this.authService.recoveryPassword(recoveryPasswordDto);

    return {
      succeeded: true,
      data: null,
      message:
        'Se o e-mail estiver cadastrado, você receberá instruções em breve.',
    };
  }

  @Post('reset-password')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Redefinir senha',
    description: 'Endpoint responsável por redefinir a senha de um usuário.',
  })
  @ApiBody({
    description: 'Dados necessários para redefinir a senha do usuário',
    type: ResetPasswordDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma mensagem de sucesso caso a recuperação seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'A conta do usuário foi ativada com sucesso.',
        },
      },
    },
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const userEmail = await this.authService.resetPassword(resetPasswordDto);

    return {
      succeeded: true,
      data: null,
      message: `A senha do usuário ${userEmail} foi redefinida com sucesso.`,
    };
  }

  @Post('sign-in')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Autenticar usuário',
    description: 'Endpoint responsável por autenticar o usuário.',
  })
  @ApiBody({
    description: 'Dados necessários para autenticação do usuário',
    type: AuthDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: SignInResponseDto,
  })
  async signIn(@Body() authDto: AuthDto) {
    return await this.authService.signIn(authDto);
  }
}
