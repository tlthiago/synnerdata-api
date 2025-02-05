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
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
