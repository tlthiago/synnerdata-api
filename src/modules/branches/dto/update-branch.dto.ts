import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateBranchDto } from './create-branch.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateBranchDto extends OmitType(CreateBranchDto, [
  'criadoPor',
] as const) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização da filial.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
