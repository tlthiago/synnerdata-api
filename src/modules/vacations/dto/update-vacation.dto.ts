import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateVacationDto } from './create-vacation.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateVacationDto extends PartialType(
  OmitType(CreateVacationDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização das férias.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
