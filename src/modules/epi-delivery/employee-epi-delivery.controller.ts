import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
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
import { EpiDeliveryResponseDto } from './dto/epi-delivery-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../../common/decorators/dto/current-user.dto';

@Controller('v1/funcionarios')
@ApiTags('Entregas de Epis')
export class EmployeeEpiDeliveryController {
  constructor(private readonly epiDeliveryService: EpiDeliveryService) {}

  @Post(':funcionarioId/entregas-de-epis')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar uma entregas de epis',
    description: 'Endpoint responsável por cadastrar uma entregas de epis.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar a entregas de epis.',
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
    @Param('funcionarioId', ParseUUIDPipe) employeeId: string,
    @Body() createEpiDeliveryDto: CreateEpiDeliveryDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const epiDelivery = await this.epiDeliveryService.create(
      employeeId,
      createEpiDeliveryDto,
      user.id,
    );

    return {
      succeeded: true,
      data: epiDelivery,
      message: `Entrega de epis cadastrada com sucesso, id: #${epiDelivery.id}.`,
    };
  }

  @Get(':funcionarioId/entregas-de-epis')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos as entregas de epis de um funcionário',
    description:
      'Endpoint responsável por listar todos as entregas de epis cadastradas de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de entregas de epis em casos de sucesso.',
    type: [EpiDeliveryResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseUUIDPipe) employeeId: string) {
    return this.epiDeliveryService.findAll(employeeId);
  }

  @Get('entregas-de-epis/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar entregas de epis',
    description:
      'Endpoint responsável por listar dados de um entregas de epis.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da entregas de epis.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da entregas de epis em casos de sucesso.',
    type: EpiDeliveryResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.epiDeliveryService.findOne(id);
  }

  @Patch('entregas-de-epis/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de uma entregas de epis',
    description:
      'Endpoint responsável por atualizar os dados de uma entregas de epis.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da entregas de epis.',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description:
      'Dados necessários para atualizar os dados da entregas de epis',
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEpiDeliveryDto: UpdateEpiDeliveryDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const epiDelivery = await this.epiDeliveryService.update(
      id,
      updateEpiDeliveryDto,
      user.id,
    );

    return {
      succeeded: true,
      data: epiDelivery,
      message: `Entrega de epis id: #${epiDelivery.id} atualizada com sucesso.`,
    };
  }

  @Delete('entregas-de-epis/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir uma entregas de epis',
    description: 'Endpoint responsável por excluir uma entregas de epis.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da entregas de epis.',
    type: 'string',
    required: true,
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
          description: 'Entregas de epis excluída com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const epiDelivery = await this.epiDeliveryService.remove(id, user.id);

    return {
      succeeded: true,
      data: epiDelivery,
      message: `Entrega de epis id: #${epiDelivery.id} excluída com sucesso.`,
    };
  }
}
