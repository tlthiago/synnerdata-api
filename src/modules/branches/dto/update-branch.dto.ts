import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateBranchDto } from './create-branch.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateBranchDto extends PartialType(
  OmitType(CreateBranchDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização da filial.',
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
