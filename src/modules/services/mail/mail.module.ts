import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'mailhog',
        port: 1025,
        secure: false,
        auth: undefined,
      },
      defaults: {
        from: '"No Reply" <noreply@synerdata.com>',
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
