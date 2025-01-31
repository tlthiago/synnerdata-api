import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProjectDto extends PartialType(
  OmitType(CreateProjectDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização do epi.',
  })
  @IsNotEmpty()
  @IsNumber()
  atualizadoPor: number;
}
