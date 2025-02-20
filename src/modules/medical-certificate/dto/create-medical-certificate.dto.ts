import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Length,
  IsDateString,
} from 'class-validator';

export class CreateMedicalCertificateDto {
  @ApiProperty({ description: 'Data início do atestado.' })
  @IsDateString()
  @IsNotEmpty()
  dataInicio: string;

  @ApiProperty({ description: 'Data final do atestado.' })
  @IsDateString()
  @IsNotEmpty()
  dataFim: string;

  @ApiProperty({ description: 'Motivo do atestado.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  motivo: string;

  @ApiProperty({
    description: 'Usuário responsável pelo cadastro do atestado.',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
