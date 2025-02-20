import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Expose, Transform } from 'class-transformer';

export class PromotionResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Nova função.' })
  @Expose()
  funcaoId: number;

  @ApiProperty({ description: 'Novo salário.' })
  @Expose()
  salario: number;

  @ApiProperty({ description: 'Data da promoção.' })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  data: string;
}
