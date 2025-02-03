import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';

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
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  data: string;

  @ApiProperty({
    description: 'Usuário responsável pelo cadastro do atestado.',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
