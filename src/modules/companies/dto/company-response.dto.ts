import { ApiProperty } from '@nestjs/swagger';

export class CompanyResponseDto {
  @ApiProperty({ description: 'ID da empresa.' })
  id: number;

  @ApiProperty({ description: 'Nome fantasia.' })
  nomeFantasia: string;

  @ApiProperty({ description: 'Razão social.' })
  razaoSocial: string;

  @ApiProperty({ description: 'CNPJ.' })
  cnpj: string;

  @ApiProperty({ description: 'Rua' })
  rua: string;

  @ApiProperty({ description: 'Número.' })
  numero: string;

  @ApiProperty({ description: 'Complemento.' })
  complemento: string;

  @ApiProperty({ description: 'Bairro.' })
  bairro: string;

  @ApiProperty({ description: 'Cidade.' })
  cidade: string;

  @ApiProperty({ description: 'Estado.' })
  estado: string;

  @ApiProperty({ description: 'CEP.' })
  cep: string;

  @ApiProperty({ description: 'Data da Fundação.' })
  dataFundacao: Date;

  @ApiProperty({ description: 'Telefone.' })
  telefone: string;

  @ApiProperty({ description: 'Faturamento.' })
  faturamento: number;

  @ApiProperty({ description: 'Regime Tributário.' })
  regimeTributario: string;

  @ApiProperty({ description: 'Inscrição Estadual.' })
  inscricaoEstadual: string;

  @ApiProperty({ description: 'CNAE Principal.' })
  cnaePrincipal: string;

  @ApiProperty({ description: 'Segmento.' })
  segmento: string;

  @ApiProperty({ description: 'Ramo de atuação.' })
  ramoAtuacao: string;

  @ApiProperty({ description: 'Logotipo.' })
  logoUrl: string;

  @ApiProperty({ description: 'Status.' })
  status: string;

  @ApiProperty({ description: 'Criado por.' })
  criadoPor: string;

  @ApiProperty({ description: 'Criado em.' })
  criadoEm: string;

  @ApiProperty({ description: 'Atualizado por.' })
  atualizadoPor: string;

  @ApiProperty({ description: 'Atualizado em.' })
  atualizadoEm: string;
}
