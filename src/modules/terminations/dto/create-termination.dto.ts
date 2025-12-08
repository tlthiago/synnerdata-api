import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsDateString } from 'class-validator';
import { IsNotFutureDate } from '../../../common/validators/is-not-future-date.validator';

export class CreateTerminationDto {
  @ApiProperty({ description: 'Data da demissão.' })
  @IsDateString()
  @IsNotEmpty()
  @IsNotFutureDate()
  data: string;

  @ApiProperty({ description: 'Motivo interno da demissão.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  motivoInterno: string;

  @ApiProperty({ description: 'Motivo trabalhista da demissão.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  motivoTrabalhista: string;

  @ApiProperty({ description: 'Ação trabalhista.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  acaoTrabalhista: string;

  @ApiProperty({ description: 'Forma de demissão.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  formaDemissao: string;
}
