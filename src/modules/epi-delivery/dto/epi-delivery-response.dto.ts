import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Transform } from 'class-transformer';

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

export class EpiDeliveryResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Data da entrega do(s) epi(s).' })
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  data: string;

  @ApiProperty({ description: 'Epis entregues.', type: [EpiResponseDto] })
  epis: EpiResponseDto[];

  @ApiProperty({ description: 'Motivo da entrega.' })
  motivo: string;

  @ApiProperty({ description: 'Responsável pela entrega.' })
  entreguePor: string;
}
