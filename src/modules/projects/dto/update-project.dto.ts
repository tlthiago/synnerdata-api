import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProjectDto extends PartialType(
  OmitType(CreateProjectDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização do projeto.',
  })
  @IsNotEmpty({
    message: 'O usuário responsável pela atualização deve ser informado.',
  })
  @IsNumber(
    {},
    {
      message: 'O identificador do usuário deve ser um número.',
    },
  )
  atualizadoPor: number;
}
