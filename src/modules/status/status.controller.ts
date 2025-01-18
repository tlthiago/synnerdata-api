import { Controller, Get } from '@nestjs/common';
import { StatusService } from './status.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtém o status da API',
    description:
      'Este endpoint retorna informações sobre o status da API, incluindo versão, tempo de execução, data de lançamento, endereço da documento, e dependencias como banco de dados, contendo número máximo de conexões e número de conexões abertas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna as informações de status do banco de dados.',
    schema: {
      type: 'object',
      properties: {
        updated_at: {
          type: 'string',
          format: 'date-time',
          description: 'Data e hora da requisição do status',
        },
        name: { type: 'string', description: 'Nome da API' },
        description: { type: 'string', description: 'Descrição da API' },
        status: { type: 'string', description: 'Status de atividade da API' },
        version: { type: 'string', description: 'Versão da API' },
        uptime: { type: 'string', description: 'Tempo de execução da API' },
        release_date: {
          type: 'string',
          format: 'date-time',
          description: 'Data de lançamento',
        },
        documentation: {
          type: 'string',
          description: 'Endereço da documentação',
        },
        dependencies: {
          type: 'object',
          properties: {
            database: {
              type: 'object',
              properties: {
                version: {
                  type: 'string',
                  description: 'Versão do banco de dados',
                },
                max_connections: {
                  type: 'number',
                  description: 'Número máximo de conexões do banco;',
                },
                opened_connections: {
                  type: 'number',
                  description: 'Número de conexões abertas',
                },
              },
            },
          },
        },
      },
    },
  })
  async apiStatus() {
    return await this.statusService.getApiStatus();
  }
}
