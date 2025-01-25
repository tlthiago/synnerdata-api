import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCompanyDto extends OmitType(CreateCompanyDto, [
  'criadoPor',
] as const) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização da empresa.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
