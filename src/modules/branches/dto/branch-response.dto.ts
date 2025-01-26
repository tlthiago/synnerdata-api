import { ApiProperty } from '@nestjs/swagger';

export class BranchResponseDto {
  @ApiProperty({ description: 'ID da filial.' })
  id: number;

  @ApiProperty({ description: 'Nome.' })
  nome: string;

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
