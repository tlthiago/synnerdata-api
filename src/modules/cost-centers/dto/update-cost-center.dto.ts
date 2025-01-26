import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateCostCenterDto } from './create-cost-center.dto';

export class UpdateCostCenterDto extends OmitType(CreateCostCenterDto, [
  'criadoPor',
] as const) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização do centro de custo.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
