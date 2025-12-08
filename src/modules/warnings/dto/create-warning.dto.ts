import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsDateString } from 'class-validator';
import { IsNotFutureDate } from '../../../common/validators/is-not-future-date.validator';

export class CreateWarningDto {
  @ApiProperty({ description: 'Data da advertência.' })
  @IsDateString()
  @IsNotEmpty()
  @IsNotFutureDate()
  data: string;

  @ApiProperty({ description: 'Motivo da advertência.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  motivo: string;
}
