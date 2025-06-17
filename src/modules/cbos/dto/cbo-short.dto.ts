import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CboShortDto {
  @ApiProperty({ description: 'ID do cbo' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nome do cbo' })
  @Expose()
  nome: string;
}
