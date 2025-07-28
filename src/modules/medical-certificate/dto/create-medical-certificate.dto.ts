import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsDateString,
  Matches,
  ValidateIf,
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

  @ValidateIf((obj) => obj.cid !== '')
  @Matches(/^([A-TV-Z][0-9]{2})(\.[0-9A-Z]{1,2})?$/, {
    message: 'O CID deve seguir o formato válido (ex: J45.0)',
  })
  cid?: string;
}
