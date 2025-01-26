import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateDepartmentDto } from './create-department.dto';

export class UpdateDepartmentDto extends OmitType(CreateDepartmentDto, [
  'criadoPor',
] as const) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização do setor.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
