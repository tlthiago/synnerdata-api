import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateCboDto {
  @ApiProperty({ description: 'Nome do cbo.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  nome: string;
}
