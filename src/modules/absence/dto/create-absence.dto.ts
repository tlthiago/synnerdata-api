import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsDateString } from 'class-validator';
import { IsNotFutureDate } from '../../../common/validators/is-not-future-date.validator';

export class CreateAbsenceDto {
  @ApiProperty({ description: 'Data da falta.' })
  @IsDateString()
  @IsNotEmpty()
  @IsNotFutureDate()
  data: string;

  @ApiProperty({ description: 'Motivo da falta.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  motivo: string;
}
