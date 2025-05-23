import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsArray,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'Nome da função.' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nome: string;

  @ApiProperty({ description: 'Epis da função.', type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  epis: string[];
}
