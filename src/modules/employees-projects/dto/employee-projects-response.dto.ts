import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/utils/dto/base-response.dto';
import { Transform } from 'class-transformer';

class EmployeeResponseDto {
  @ApiProperty({ description: 'ID do funcionário' })
  id: number;

  @ApiProperty({ description: 'Nome do funcionário' })
  nome: string;
}

export class EmployeeProjectsResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Nome do projeto.' })
  nome: string;

  @ApiProperty({ description: 'Descrição do projeto.' })
  descricao: string;

  @ApiProperty({ description: 'Data de início do projeto.' })
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  dataInicio: string;

  @ApiProperty({ description: 'Cno do projeto' })
  cno: string;

  @ApiProperty({
    description: 'Funcionários do projeto.',
    type: [EmployeeResponseDto],
  })
  funcionarios: EmployeeResponseDto[];
}
