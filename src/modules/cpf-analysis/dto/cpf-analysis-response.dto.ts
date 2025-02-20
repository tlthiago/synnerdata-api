import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Expose } from 'class-transformer';

export class CpfAnalysisResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Descrição da análise.' })
  @Expose()
  descricao: string;
}
