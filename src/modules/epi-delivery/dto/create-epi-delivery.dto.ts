import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsArray,
  ArrayMinSize,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class CreateEpiDeliveryDto {
  @ApiProperty({ description: 'Data da entrega do(s) epi(s).' })
  @IsDateString()
  @IsNotEmpty()
  data: string;

  @ApiProperty({ description: 'Epi(s) entregues.', type: [String] })
  @IsArray()
  @IsUUID('4', {
    each: true,
    message: 'O identificador do(s) epi(s) deve ser um número',
  })
  @ArrayMinSize(1)
  epis: string[];

  @ApiProperty({ description: 'Motivo da entrega.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  motivo: string;

  @ApiProperty({ description: 'Responsável pela entrega.' })
  @IsString()
  @IsNotEmpty()
  entreguePor: string;
}
