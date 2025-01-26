import { CreateEpiDto } from './create-epi.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateEpiDto extends OmitType(CreateEpiDto, [
  'criadoPor',
] as const) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização do epi.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
