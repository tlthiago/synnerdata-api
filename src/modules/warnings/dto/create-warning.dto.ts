import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateWarningDto {
  @ApiProperty({ description: 'Data da advertência.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  data: string;

  @ApiProperty({ description: 'Motivo da advertência.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  motivo: string;

  @ApiProperty({
    description: 'Usuário responsável pelo cadastro da advertência.',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
