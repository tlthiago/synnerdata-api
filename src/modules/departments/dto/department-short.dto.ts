import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DepartmentShortDto {
  @ApiProperty({ description: 'ID do setor' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nome do setor' })
  @Expose()
  nome: string;
}
