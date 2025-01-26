import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BaseDeleteDto {
  @ApiProperty({
    description: 'Usuário responsável pela exclusão.',
  })
  @IsNotEmpty()
  @IsNumber()
  excluidoPor: number;
}
