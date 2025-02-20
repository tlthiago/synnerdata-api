import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Expose, Transform } from 'class-transformer';

export class EpisResponseDto {
  @ApiProperty({ description: 'ID do EPI' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Nome do EPI' })
  @Expose()
  nome: string;

  @ApiProperty({ description: 'Descrição do EPI' })
  @Expose()
  descricao: string;

  @ApiProperty({ description: 'Equipamentos do EPI' })
  @Expose()
  equipamentos: string;
}

export class EpiDeliveryResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Data da entrega do(s) epi(s).' })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  data: string;

  @ApiProperty({ description: 'Epis entregues.', type: [EpisResponseDto] })
  @Expose()
  epis: EpisResponseDto[];

  @ApiProperty({ description: 'Motivo da entrega.' })
  @Expose()
  motivo: string;

  @ApiProperty({ description: 'Responsável pela entrega.' })
  @Expose()
  entreguePor: string;
}
