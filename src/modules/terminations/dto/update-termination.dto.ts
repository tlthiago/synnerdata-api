import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateTerminationDto } from './create-termination.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTerminationDto extends PartialType(
  OmitType(CreateTerminationDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização da demissão.',
  })
  @IsNotEmpty({
    message: 'O usuário responsável pela atualização deve ser informado.',
  })
  @IsNumber(
    {},
    {
      message: 'O identificador do usuário deve ser um número.',
    },
  )
  atualizadoPor: number;
}
