import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword, IsUUID } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token de recuperação da senha.' })
  @IsUUID()
  recoveryToken: string;

  @ApiProperty({ description: 'Nova senha do usuário.' })
  @IsNotEmpty()
  @IsStrongPassword()
  novaSenha: string;
}
