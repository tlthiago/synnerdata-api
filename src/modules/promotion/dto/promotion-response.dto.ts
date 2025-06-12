import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Expose, Transform, Type } from 'class-transformer';
import { EmployeeShortDto } from '../../../modules/employees/dto/employee-short.dto';
import { RoleShortDto } from '../../../modules/roles/dto/role-short.dto';

export class PromotionResponseDto extends BaseResponseDto {
  @ApiProperty({ type: EmployeeShortDto })
  @Expose()
  @Type(() => EmployeeShortDto)
  funcionario: EmployeeShortDto;

  @ApiProperty({ type: RoleShortDto })
  @Expose()
  @Type(() => RoleShortDto)
  funcao: RoleShortDto;

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
