import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';

export class CpfAnalysisResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Descrição da análise.' })
  descricao: string;
}
