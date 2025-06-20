import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Length,
  IsDateString,
  IsOptional,
  IsPostalCode,
} from 'class-validator';

export class CompleteCompanyRegistrationDto {
  @ApiProperty({ description: 'Data da Fundação.' })
  @IsDateString()
  @IsNotEmpty()
  dataFundacao: Date;

  @ApiProperty({ description: 'Faturamento.' })
  @IsNumber()
  @IsNotEmpty()
  faturamento: number;

  @ApiProperty({ description: 'Regime Tributário.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  regimeTributario: string;

  @ApiProperty({ description: 'Inscrição Estadual.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  inscricaoEstadual: string;

  @ApiProperty({ description: 'CNAE Principal.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  cnaePrincipal: string;

  @ApiProperty({ description: 'Segmento.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  segmento: string;

  @ApiProperty({ description: 'Ramo de atuação.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  ramoAtuacao: string;

  @ApiProperty({ description: 'Rua' })
  @IsString()
  @Length(1, 255)
  rua: string;

  @ApiProperty({ description: 'Número.' })
  @IsString()
  @Length(1, 10)
  numero: string;

  @ApiProperty({ description: 'Complemento.' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  complemento?: string;

  @ApiProperty({ description: 'Bairro.' })
  @IsString()
  @Length(1, 100)
  bairro: string;

  @ApiProperty({ description: 'Cidade.' })
  @IsString()
  @Length(1, 100)
  cidade: string;

  @ApiProperty({ description: 'Estado.' })
  @IsString()
  @Length(2, 2)
  estado: string;

  @ApiProperty({ description: 'CEP.' })
  @IsPostalCode('BR', {
    message: 'CEP deve estar no formato 00000-000 ou 00000000',
  })
  cep: string;
}
