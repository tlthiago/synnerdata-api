import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CostCenterResponseDto {
  @ApiProperty({ description: 'ID' })
  id: number;

  @ApiProperty({ description: 'Nome' })
  nome: string;

  @ApiProperty({ description: 'Status' })
  status: string;

  @ApiProperty({ description: 'Criado por' })
  criadoPor: string;

  @ApiProperty({ description: 'Criado em' })
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'America/Sao_Paulo',
    }).format(new Date(value)),
  )
  criadoEm: string;

  @ApiProperty({ description: 'Atualizado por' })
  atualizadoPor: string;

  @ApiProperty({ description: 'Atualizado em' })
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'America/Sao_Paulo',
    }).format(new Date(value)),
  )
  atualizadoEm: string;
}
