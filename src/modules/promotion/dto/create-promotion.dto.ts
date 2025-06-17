import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString, IsUUID, IsNumber } from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty({ description: 'Nova função.' })
  @IsUUID()
  @IsNotEmpty()
  funcaoId: string;

  @ApiProperty({ description: 'Novo salário.' })
  @IsNumber()
  @IsNotEmpty()
  salario: number;

  @ApiProperty({ description: 'Data da promoção.' })
  @IsDateString()
  @IsNotEmpty()
  data: string;
}
