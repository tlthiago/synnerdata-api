import { IsEmail, IsUrl } from 'class-validator';

export class SendMailDto {
  @IsEmail()
  email: string;

  @IsUrl()
  link: string;
}
