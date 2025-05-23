import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';

export class CompanyResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Nome fantasia.' })
  @Expose()
  nomeFantasia: string;

  @ApiProperty({ description: 'Razão social.' })
  @Expose()
  razaoSocial: string;

  @ApiProperty({ description: 'CNPJ.' })
  @Expose()
  cnpj: string;

  @ApiProperty({ description: 'Rua' })
  @Expose()
  rua: string;

  @ApiProperty({ description: 'Número.' })
  @Expose()
  numero: string;

  @ApiProperty({ description: 'Complemento.' })
  @Expose()
  complemento: string;

  @ApiProperty({ description: 'Bairro.' })
  @Expose()
  bairro: string;

  @ApiProperty({ description: 'Cidade.' })
  @Expose()
  cidade: string;

  @ApiProperty({ description: 'Estado.' })
  @Expose()
  estado: string;

  @ApiProperty({ description: 'CEP.' })
  @Expose()
  cep: string;

  @ApiProperty({ description: 'Data da Fundação.' })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  dataFundacao: string;

  @ApiProperty({ description: 'Telefone.' })
  @Expose()
  telefone: string;

  @ApiProperty({ description: 'Celular.' })
  @Expose()
  celular: string;

  @ApiProperty({ description: 'Faturamento.' })
  @Expose()
  faturamento: number;

  @ApiProperty({ description: 'Regime Tributário.' })
  @Expose()
  regimeTributario: string;

  @ApiProperty({ description: 'Inscrição Estadual.' })
  @Expose()
  inscricaoEstadual: string;

  @ApiProperty({ description: 'CNAE Principal.' })
  @Expose()
  cnaePrincipal: string;

  @ApiProperty({ description: 'Segmento.' })
  @Expose()
  segmento: string;

  @ApiProperty({ description: 'Ramo de atuação.' })
  @Expose()
  ramoAtuacao: string;

  @ApiProperty({ description: 'Logotipo.' })
  @Expose()
  logoUrl: string;
}
