import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Expose, Transform } from 'class-transformer';

export class BranchResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Nome.' })
  @Expose()
  nome: string;

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
  dataFundacao: Date;

  @ApiProperty({ description: 'Telefone.' })
  @Expose()
  telefone: string;
}
