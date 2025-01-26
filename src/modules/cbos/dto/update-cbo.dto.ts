import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateCboDto } from './create-cbo.dto';

export class UpdateCboDto extends OmitType(CreateCboDto, [
  'criadoPor',
] as const) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização do cbo.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
