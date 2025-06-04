import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class ResendInviteUserDto {
  @ApiProperty({ description: 'Email do usuário.' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
