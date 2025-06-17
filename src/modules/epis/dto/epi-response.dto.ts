import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Expose } from 'class-transformer';

export class EpiResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Nome' })
  @Expose()
  nome: string;

  @ApiProperty({ description: 'Descrição' })
  @Expose()
  descricao: string;

  @ApiProperty({ description: 'Equipamentos' })
  @Expose()
  equipamentos: string;
}
