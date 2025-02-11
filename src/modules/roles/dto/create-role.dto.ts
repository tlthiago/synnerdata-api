import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Length,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'Nome da função.' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nome: string;

  @ApiProperty({ description: 'Epis da função.', type: [Number] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true, message: 'O identificador do(s) epi(s) deve ser um número' })
  epis: number[];

  @ApiProperty({
    description: 'Usuário responsável pela criação da função.',
  })
  @IsNotEmpty()
  @IsNumber()
  criadoPor: number;
}
