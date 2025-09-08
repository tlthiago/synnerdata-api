import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CompanyResponseDto } from './company-response.dto';

export class CompanyWithStatsResponseDto extends OmitType(CompanyResponseDto, [
  'quantidadeUsuarios',
  'quantidadeFuncionarios',
] as const) {
  @ApiProperty({ description: 'Quantidade de usuários', type: 'number' })
  @Expose()
  quantidadeUsuarios: number;

  @ApiProperty({ description: 'Quantidade de funcionários', type: 'number' })
  @Expose()
  quantidadeFuncionarios: number;

  @ApiProperty({ description: 'Status da assinatura' })
  @Expose()
  statusAssinatura: string;
}
