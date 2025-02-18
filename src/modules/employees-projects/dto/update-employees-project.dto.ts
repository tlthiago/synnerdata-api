import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateEmployeesProjectDto } from './create-employees-project.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateEmployeesProjectDto extends PartialType(
  OmitType(CreateEmployeesProjectDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description:
      'Usuário responsável pela atualização do funcionário no projeto.',
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
