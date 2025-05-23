import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateCostCenterDto {
  @ApiProperty({ description: 'Nome.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  nome: string;
}
