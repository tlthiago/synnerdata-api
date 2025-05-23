import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-email')
  sendEmail(@Body() sendMailDto: SendMailDto) {
    return this.mailService.sendActivationAccountEmail(sendMailDto);
  }
}
