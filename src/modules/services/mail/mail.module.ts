import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersModule } from '../../../modules/users/users.module';

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
        from: '"No Reply - Synerdata" <noreply@synerdata.com>',
      },
    }),
    UsersModule,
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
