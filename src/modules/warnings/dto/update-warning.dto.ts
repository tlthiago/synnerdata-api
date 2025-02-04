import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateWarningDto } from './create-warning.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateWarningDto extends PartialType(
  OmitType(CreateWarningDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização da advertência.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
