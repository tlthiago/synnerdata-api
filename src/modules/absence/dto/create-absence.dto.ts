import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateAbsenceDto {
  @ApiProperty({ description: 'Data da falta.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  data: string;

  @ApiProperty({ description: 'Motivo da falta.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  motivo: string;

  @ApiProperty({
    description: 'Usuário responsável pelo cadastro da falta.',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
