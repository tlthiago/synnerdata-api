import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  ArrayMinSize,
  IsDateString,
} from 'class-validator';

export class CreateEmployeesProjectDto {
  @ApiProperty({ description: 'Funcionários do projeto.', type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  funcionarios: number[];

  @ApiProperty({ description: 'Data de ingresso no projeto.' })
  @IsDateString()
  @IsNotEmpty()
  dataInicio: string;

  @ApiProperty({
    description:
      'Usuário responsável pelo cadastro do funcionário em um projeto.',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
