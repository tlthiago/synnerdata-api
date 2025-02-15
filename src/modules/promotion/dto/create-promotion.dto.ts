import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty({ description: 'Nova função.' })
  @IsNumber()
  @IsNotEmpty()
  funcaoId: number;

  @ApiProperty({ description: 'Novo salário.' })
  @IsNumber()
  @IsNotEmpty()
  salario: number;

  @ApiProperty({ description: 'Data da promoção.' })
  @IsDateString()
  @IsNotEmpty()
  data: string;

  @ApiProperty({
    description: 'Usuário responsável pelo cadastro da promoção.',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
