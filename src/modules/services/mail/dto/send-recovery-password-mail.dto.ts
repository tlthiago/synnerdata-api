import { IsEmail, IsUUID } from 'class-validator';

export class SendRecoveryPasswordMailDto {
  @IsEmail()
  email: string;

  @IsUUID()
  recoveryToken: string;
}
