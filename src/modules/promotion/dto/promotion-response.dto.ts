import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Transform } from 'class-transformer';

export class PromotionResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Nova função.' })
  funcaoId: number;

  @ApiProperty({ description: 'Novo salário.' })
  salario: number;

  @ApiProperty({ description: 'Data da promoção.' })
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  data: string;
}
