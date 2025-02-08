import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCompanyDto extends PartialType(
  OmitType(CreateCompanyDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização da empresa.',
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
