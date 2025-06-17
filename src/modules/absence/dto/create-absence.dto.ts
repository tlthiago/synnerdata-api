import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsDateString } from 'class-validator';

export class CreateAbsenceDto {
  @ApiProperty({ description: 'Data da falta.' })
  @IsDateString()
  @IsNotEmpty()
  data: string;

  @ApiProperty({ description: 'Motivo da falta.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  motivo: string;
}
