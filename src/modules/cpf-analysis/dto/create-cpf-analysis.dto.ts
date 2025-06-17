import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateCpfAnalysisDto {
  @ApiProperty({ description: 'Descrição da análise.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  descricao: string;
}
