import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateMedicalCertificateDto } from './create-medical-certificate.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateMedicalCertificateDto extends PartialType(
  OmitType(CreateMedicalCertificateDto, ['criadoPor'] as const),
) {
  @ApiProperty({
    description: 'Usuário responsável pela atualização do atestado.',
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
