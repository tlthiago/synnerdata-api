import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendAccountCreationEmail(sendMailDto: SendMailDto) {
    const { email, link } = sendMailDto;

    try {
      const response = await this.mailerService.sendMail({
        to: email,
        subject: 'Bem-vindo à Synerdata! Finalize seu cadastro',
        html: `
          <p><strong>Olá,</strong></p>
          <p>Parabéns! Seu pagamento foi confirmado e agora você está a um passo de acessar todos os benefícios da <strong>Synerdata</strong>. 🎉</p>
          <p>Para concluir seu cadastro e ativar sua conta, basta clicar no link abaixo:</p>
          <p style="text-align: center;">
            <a href="${link}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
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
}
