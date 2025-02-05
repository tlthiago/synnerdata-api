import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreatePromotionDto } from './create-promotion.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePromotionDto extends PartialType(
  OmitType(CreatePromotionDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização da promoção.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
