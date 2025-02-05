import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateVacationDto {
  @ApiProperty({ description: 'Data de início das férias.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  dataInicio: string;

  @ApiProperty({ description: 'Data de encerramento das férias.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  dataFim: string;

  @ApiProperty({
    description: 'Usuário responsável pelo cadastro das férias.',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
