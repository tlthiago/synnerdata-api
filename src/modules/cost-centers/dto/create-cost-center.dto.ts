import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateCostCenterDto {
  @ApiProperty({ description: 'Nome.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  nome: string;

  @ApiProperty({
    description: 'Usuário responsável pela criação do centro de custo.',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
