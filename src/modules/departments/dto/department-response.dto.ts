import { ApiProperty } from '@nestjs/swagger';

export class DepartmentResponseDto {
  @ApiProperty({ description: 'ID' })
  id: number;

  @ApiProperty({ description: 'Nome' })
  nome: string;

  @ApiProperty({ description: 'Status' })
  status: string;

  @ApiProperty({ description: 'Criado por' })
  criadoPor: string;

  @ApiProperty({ description: 'Criado em' })
  criadoEm: string;

  @ApiProperty({ description: 'Atualizado por' })
  atualizadoPor: string;

  @ApiProperty({ description: 'Atualizado em' })
  atualizadoEm: string;
}
