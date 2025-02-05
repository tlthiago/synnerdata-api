import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateLaborActionDto } from './create-labor-action.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateLaborActionDto extends PartialType(
  OmitType(CreateLaborActionDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização da ação trabalhista.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
