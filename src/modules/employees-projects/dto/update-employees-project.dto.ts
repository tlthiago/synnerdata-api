import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateEmployeesProjectDto } from './create-employees-project.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateEmployeesProjectDto extends PartialType(
  OmitType(CreateEmployeesProjectDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description:
      'Usuário responsável pela atualização do cadastro do funcionário em um projeto.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
