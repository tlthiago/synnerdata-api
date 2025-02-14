import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import {
  Expose,
  // Transform
} from 'class-transformer';

export class MedicalCertificateResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Data inicial do atestado.' })
  @Expose()
  // @Transform(({ value }) =>
  //   new Intl.DateTimeFormat('pt-BR', {
  //     dateStyle: 'short',
  //   }).format(new Date(value)),
  // )
  dataInicio: Date;

  @ApiProperty({ description: 'Data final do atestado.' })
  @Expose()
  // @Transform(({ value }) =>
  //   new Intl.DateTimeFormat('pt-BR', {
  //     dateStyle: 'short',
  //   }).format(new Date(value)),
  // )
  dataFim: Date;

  @ApiProperty({ description: 'Motivo do atestado.' })
  @Expose()
  motivo: string;
}
