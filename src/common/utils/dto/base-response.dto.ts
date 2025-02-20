import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { UsersResponseDto } from '../../../modules/users/dto/user-response.dto';

export class BaseResponseDto {
  @ApiProperty({ description: 'ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Status' })
  @Expose()
  status: string;

  @ApiProperty({ description: 'Criado por' })
  @Expose()
  @Type(() => UsersResponseDto)
  @Transform(({ value }) => value?.nome)
  criadoPor: UsersResponseDto;

  @ApiProperty({ description: 'Criado em' })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'America/Sao_Paulo',
    }).format(new Date(value)),
  )
  criadoEm: Date;

  @ApiProperty({ description: 'Atualizado por' })
  @Expose()
  @Type(() => UsersResponseDto)
  @Transform(({ value }) => value?.nome)
  atualizadoPor: UsersResponseDto;

  @ApiProperty({ description: 'Atualizado em' })
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'America/Sao_Paulo',
    }).format(new Date(value)),
  )
  atualizadoEm: Date;
}
