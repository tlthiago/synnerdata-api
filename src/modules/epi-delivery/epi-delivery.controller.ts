import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { EpiDeliveryService } from './epi-delivery.service';
import { CreateEpiDeliveryDto } from './dto/create-epi-delivery.dto';
import { UpdateEpiDeliveryDto } from './dto/update-epi-delivery.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';
import { EpiDeliveryResponseDto } from './dto/epi-delivery-response.dto';

@Controller('v1/funcionarios')
@ApiTags('Entregas de Epis')
export class EpiDeliveryController {
  constructor(private readonly epiDeliveryService: EpiDeliveryService) {}

  @Post(':funcionarioId/entrega-de-epis')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar uma entrega de epis',
    description: 'Endpoint responsável por cadastrar uma entrega de epis.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar a entrega de epis.',
    type: CreateEpiDeliveryDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna um mensagem de sucesso caso a criação seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Entrega de epis cadastrada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('funcionarioId', ParseIntPipe) employeeId: number,
    @Body() createEpiDeliveryDto: CreateEpiDeliveryDto,
  ) {
    const epiDeliveryId = await this.epiDeliveryService.create(
      employeeId,
      createEpiDeliveryDto,
    );

    return {
      succeeded: true,
      data: null,
      message: `Entrega de epis cadastrada com sucesso, id: #${epiDeliveryId}.`,
    };
  }

  @Get(':funcionarioId/entrega-de-epis')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos as entrega de epis',
    description:
      'Endpoint responsável por listar todos as entrega de epis cadastradas de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de entrega de epis em casos de sucesso.',
    type: [EpiDeliveryResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseIntPipe) employeeId: number) {
    return this.epiDeliveryService.findAll(employeeId);
  }

  @Get('entrega-de-epis/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar entrega de epis',
    description: 'Endpoint responsável por listar dados de um entrega de epis.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da entrega de epis.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da entrega de epis em casos de sucesso.',
    type: EpiDeliveryResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.epiDeliveryService.findOne(id);
  }

  @Patch('entrega-de-epis/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de uma entrega de epis',
    description:
      'Endpoint responsável por atualizar os dados de uma entrega de epis.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da entrega de epis.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da entrega de epis',
    type: UpdateEpiDeliveryDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna um mensagem de sucesso caso a atualização seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Entrega de epis atualizada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEpiDeliveryDto: UpdateEpiDeliveryDto,
  ) {
    const epiDelivery = await this.epiDeliveryService.update(
      id,
      updateEpiDeliveryDto,
    );

    return {
      succeeded: true,
      data: epiDelivery,
      message: `Entrega de epis id: #${epiDelivery.id} atualizada com sucesso.`,
    };
  }

  @Delete('entrega-de-epis/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir uma entrega de epis',
    description: 'Endpoint responsável por excluir uma entrega de epis.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da entrega de epis.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da entrega de epis',
    type: BaseDeleteDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna um mensagem de sucesso caso a exclusão seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Entrega de epis excluída com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteEpiDeliveryDto: BaseDeleteDto,
  ) {
    await this.epiDeliveryService.remove(id, deleteEpiDeliveryDto);

    return {
      succeeded: true,
      data: null,
      message: `Entrega de epis id: #${id} excluída com sucesso.`,
    };
  }
}
