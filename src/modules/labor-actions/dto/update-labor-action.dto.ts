import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateLaborActionDto } from './create-labor-action.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateLaborActionDto extends PartialType(
  OmitType(CreateLaborActionDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização da ação trabalhista.',
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
