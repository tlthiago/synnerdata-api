import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CostCenterShortDto {
  @ApiProperty({ description: 'ID do centro de custo' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nome do centro de custo' })
  @Expose()
  nome: string;
}
