import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateAbsenceDto } from './create-absence.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAbsenceDto extends PartialType(
  OmitType(CreateAbsenceDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização da falta.',
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
