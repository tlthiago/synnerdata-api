import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateCpfAnalysisDto } from './create-cpf-analysis.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCpfAnalysisDto extends PartialType(
  OmitType(CreateCpfAnalysisDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização da análise de cpf.',
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
