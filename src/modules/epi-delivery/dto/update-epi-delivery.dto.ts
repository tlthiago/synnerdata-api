import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateEpiDeliveryDto } from './create-epi-delivery.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateEpiDeliveryDto extends PartialType(
  OmitType(CreateEpiDeliveryDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description:
      'Usuário responsável pela atualização da entrega do(s) Epi(s).',
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
