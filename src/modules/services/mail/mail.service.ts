import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';
import { UserActivationTokenService } from '../../../modules/users/users-activation-token.service';
import { SendRecoveryPasswordMailDto } from './dto/send-recovery-password-mail.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userActivationTokenService: UserActivationTokenService,
  ) {}

  async sendActivationAccountEmail(sendMailDto: SendMailDto) {
    const { email } = sendMailDto;

    const activationToken = await this.userActivationTokenService.create(email);

    try {
      const response = await this.mailerService.sendMail({
        to: email,
        subject: 'Bem-vindo à Synerdata! Finalize seu cadastro',
        html: `
          <p><strong>Olá,</strong></p>
          <p>Parabéns! Seu pagamento foi confirmado e agora você está a um passo de acessar todos os benefícios da <strong>Synerdata</strong>. 🎉</p>
          <p>Para concluir seu cadastro e ativar sua conta, basta clicar no link abaixo:</p>
          <p style="text-align: center;">
            <a href="http://localhost:3000/ativacao?email=${email}&activationToken=${activationToken}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Finalizar Cadastro
            </a>
          </p>
          <p>Caso não tenha solicitado este acesso ou precise de ajuda, entre em contato com nosso suporte.</p>
          <p>Seja bem-vindo! Estamos ansiosos para ter você com a gente. 🚀</p>
          <p>Atenciosamente,</p>
          <p><strong>Equipe Synerdata</strong></p>
        `,
      });

      return { success: true, messageId: response.messageId };
    } catch (error) {
      throw new ServiceUnavailableException(
        `Erro ao enviar e-mail: ${error.message}`,
      );
    }
  }

  async sendRecoveryPasswordEmail(
    sendRecoveryPasswordMailDto: SendRecoveryPasswordMailDto,
  ) {
    const { email, recoveryToken } = sendRecoveryPasswordMailDto;

    try {
      const response = await this.mailerService.sendMail({
        to: email,
        subject: 'Recuperação de Senha',
        html: `
          <p><strong>Olá,</strong></p>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta na <strong>Synerdata</strong>.</p>
          <p>Se foi você quem solicitou, clique no botão abaixo para criar uma nova senha:</p>
          <p style="text-align: center;">
            <a href="http://localhost:3000/redefinir-senha?recoveryToken=${recoveryToken}" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Redefinir Senha
            </a>
          </p>
          <p>Este link é válido por tempo limitado e pode ser usado apenas uma vez.</p>
          <p>Se você não solicitou essa alteração, pode ignorar este e-mail com segurança. Nenhuma ação será tomada sem sua confirmação.</p>
          <p>Em caso de dúvidas, entre em contato com nosso suporte.</p>
          <p>Atenciosamente,</p>
          <p><strong>Equipe Synerdata</strong></p>
        `,
      });

      return { success: true, messageId: response.messageId };
    } catch (error) {
      throw new ServiceUnavailableException(
        `Erro ao enviar e-mail: ${error.message}`,
      );
    }
  }
}
