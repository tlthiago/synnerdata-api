import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Expose, Type } from 'class-transformer';
import { EmployeeShortDto } from '../../employees/dto/employee-short.dto';

export class CpfAnalysisResponseDto extends BaseResponseDto {
  @ApiProperty({ type: EmployeeShortDto })
  @Expose()
  @Type(() => EmployeeShortDto)
  funcionario: EmployeeShortDto;

  @ApiProperty({ description: 'Descrição da análise.' })
  @Expose()
  descricao: string;
}
