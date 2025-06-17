import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Expose } from 'class-transformer';

export class RoleEpiResponseDto {
  @ApiProperty({ description: 'ID do EPI' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Nome do EPI' })
  @Expose()
  nome: string;
}

export class RoleResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Nome' })
  @Expose()
  nome: string;

  @ApiProperty({ description: 'Epis da função.', type: [RoleEpiResponseDto] })
  @Expose()
  epis: RoleEpiResponseDto[];
}
