import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';

class EpiResponseDto {
  @ApiProperty({ description: 'ID do EPI' })
  id: number;

  @ApiProperty({ description: 'Nome do EPI' })
  nome: string;

  @ApiProperty({ description: 'Descrição do EPI' })
  descricao: string;

  @ApiProperty({ description: 'Equipamentos do EPI' })
  equipamentos: string;
}

export class RoleResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Nome' })
  nome: string;

  @ApiProperty({ description: 'Epis da função.', type: [EpiResponseDto] })
  epis: EpiResponseDto[];
}
