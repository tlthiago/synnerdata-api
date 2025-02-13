import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StatusFuncionario } from '../enums/employees.enum';

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Status do funcionário',
    enum: StatusFuncionario,
  })
  @IsEnum(StatusFuncionario)
  @IsNotEmpty()
  status: StatusFuncionario;

  @ApiProperty({
    description: 'Usuário responsável pela atualização do funcionário.',
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
