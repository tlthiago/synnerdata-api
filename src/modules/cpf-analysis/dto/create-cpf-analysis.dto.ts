import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateCpfAnalysisDto {
  @ApiProperty({ description: 'Descrição da análise.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  descricao: string;

  @ApiProperty({
    description: 'Usuário responsável pelo cadastro da análise do CPF.',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
