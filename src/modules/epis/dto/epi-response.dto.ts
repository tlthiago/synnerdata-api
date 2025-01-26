import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';

export class EpiResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Nome' })
  nome: string;

  @ApiProperty({ description: 'Descrição' })
  descricao: string;

  @ApiProperty({ description: 'Equipamentos' })
  equipamentos: string;
}
