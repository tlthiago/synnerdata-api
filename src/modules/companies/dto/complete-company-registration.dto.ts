import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Length,
  IsDateString,
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
}
