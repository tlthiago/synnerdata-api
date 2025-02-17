import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateWarningDto } from './create-warning.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateWarningDto extends PartialType(
  OmitType(CreateWarningDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização da advertência.',
  })
  @IsNotEmpty({
    message: 'O usuário responsável pela atualização deve ser informado.',
  })
  @IsNumber(
    {},
    {
      message: 'O identificador do usuário deve ser um número.',
    },
  )
  atualizadoPor: number;
}
