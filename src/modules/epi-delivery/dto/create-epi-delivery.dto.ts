import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Length,
  IsArray,
  ArrayMinSize,
  IsDateString,
} from 'class-validator';

export class CreateEpiDeliveryDto {
  @ApiProperty({ description: 'Data da entrega do(s) epi(s).' })
  @IsDateString()
  @IsNotEmpty()
  data: string;

  @ApiProperty({ description: 'Epi(s) entregues.', type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  epis: number[];

  @ApiProperty({ description: 'Motivo da entrega.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  motivo: string;

  @ApiProperty({ description: 'Responsável pela entrega.' })
  @IsNotEmpty()
  @IsNumber()
  entreguePor: string;

  @ApiProperty({
    description: 'Usuário responsável pelo cadastro da entrega do(s) Epi(s).',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
