import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BaseDeleteDto {
  @ApiProperty({
    description: 'Usuário responsável pela exclusão.',
  })
  @IsNotEmpty({
    message: 'O usuário responsável pela exclusão deve ser informado.',
  })
  @IsNumber(
    {},
    {
      message: 'O identificador do usuário deve ser um número.',
    },
  )
  excluidoPor: number;
}
