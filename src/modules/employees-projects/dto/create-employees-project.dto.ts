import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class CreateEmployeesProjectDto {
  @ApiProperty({ description: 'Funcionários do projeto.', type: [Number] })
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  funcionarios: string[];

  @ApiProperty({ description: 'Data de ingresso no projeto.' })
  @IsDateString()
  @IsNotEmpty()
  dataInicio: string;
}
