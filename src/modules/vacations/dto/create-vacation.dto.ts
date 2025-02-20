import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateVacationDto {
  @ApiProperty({ description: 'Data de início das férias.' })
  @IsDateString()
  @IsNotEmpty()
  dataInicio: string;

  @ApiProperty({ description: 'Data de encerramento das férias.' })
  @IsDateString()
  @IsNotEmpty()
  dataFim: string;

  @ApiProperty({
    description: 'Usuário responsável pelo cadastro das férias.',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
