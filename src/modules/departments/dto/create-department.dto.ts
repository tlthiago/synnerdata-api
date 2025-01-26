import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ description: 'Nome.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  nome: string;

  @ApiProperty({ description: 'Usuário responsável pela criação do setor.' })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
