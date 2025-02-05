import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateAccidentDto } from './create-accident.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAccidentDto extends PartialType(
  OmitType(CreateAccidentDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização do acidente.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
