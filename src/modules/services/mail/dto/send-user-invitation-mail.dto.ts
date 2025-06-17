import { IsEmail, IsString } from 'class-validator';

export class SendUserInvitationMailDto {
  @IsEmail()
  email: string;

  @IsString()
  companyName: string;
}
