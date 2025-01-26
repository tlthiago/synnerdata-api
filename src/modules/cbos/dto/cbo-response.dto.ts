import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';

export class CboResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Nome' })
  nome: string;
}
