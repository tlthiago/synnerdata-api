import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StatusFuncionario } from '../enums/employees.enum';

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Status do funcionário',
    enum: StatusFuncionario,
  })
  @IsEnum(StatusFuncionario)
  @IsNotEmpty()
  statusFuncionario: StatusFuncionario;
}
