import { CreateRoleDto } from './create-role.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateRoleDto extends PartialType(
  OmitType(CreateRoleDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização da função.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
