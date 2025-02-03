import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateCpfAnalysisDto } from './create-cpf-analysis.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCpfAnalysisDto extends PartialType(
  OmitType(CreateCpfAnalysisDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização da análise do CPF.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
