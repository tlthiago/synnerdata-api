import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateEmployeeDto } from './create-employee.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateEmployeeDto extends OmitType(CreateEmployeeDto, [
  'criadoPor',
] as const) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização da Funcionário.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
