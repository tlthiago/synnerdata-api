import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RoleShortDto {
  @ApiProperty({ description: 'ID da função' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nome da função' })
  @Expose()
  nome: string;
}
