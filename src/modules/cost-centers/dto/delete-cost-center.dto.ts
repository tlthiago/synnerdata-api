import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteCostCenterDto {
  @ApiProperty({
    description: 'Usuário responsável pela exclusão do centro de custo.',
  })
  @IsNotEmpty()
  @IsNumber()
  excluidoPor: number;
}
