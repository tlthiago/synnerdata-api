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
import { LaborActionsService } from './labor-actions.service';
import { CreateLaborActionDto } from './dto/create-labor-action.dto';
import { UpdateLaborActionDto } from './dto/update-labor-action.dto';
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
import { LaborActionResponseDto } from './dto/labor-action-response.dto';

@Controller('v1/funcionarios')
@ApiTags('Ações Trabalhistas')
export class LaborActionsController {
  constructor(private readonly laborActionsService: LaborActionsService) {}

  @Post(':funcionarioId/acoes-trabalhistas')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar uma ação trabalhista',
    description: 'Endpoint responsável por cadastrar uma ação trabalhista.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar a ação trabalhista.',
    type: CreateLaborActionDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma mensagem de sucesso caso a criação seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Ação trabalhista cadastrada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('funcionarioId', ParseIntPipe) employeeId: number,
    @Body() createLaborActionDto: CreateLaborActionDto,
  ) {
    const laborActionId = await this.laborActionsService.create(
      employeeId,
      createLaborActionDto,
    );

    return {
      succeeded: true,
      data: null,
      message: `Ação trabalhista cadastrada com sucesso, id: #${laborActionId}.`,
    };
  }

  @Get(':funcionarioId/acoes-trabalhistas')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todas as ações trabalhistas',
    description:
      'Endpoint responsável por listar todas as ações trabalhistas cadastradas de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de ações trabalhistas em casos de sucesso.',
    type: [LaborActionResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseIntPipe) employeeId: number) {
    return this.laborActionsService.findAll(employeeId);
  }

  @Get('acoes-trabalhistas/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar ação trabalhista',
    description:
      'Endpoint responsável por listar dados de um ação trabalhista.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ação trabalhista.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da ação trabalhista em casos de sucesso.',
    type: LaborActionResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.laborActionsService.findOne(id);
  }

  @Patch('acoes-trabalhistas/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de uma ação trabalhista',
    description:
      'Endpoint responsável por atualizar os dados de uma ação trabalhista.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ação trabalhista.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description:
      'Dados necessários para atualizar os dados da ação trabalhista',
    type: UpdateLaborActionDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma mensagem de sucesso caso a atualização seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Ação trabalhista atualizada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLaborActionDto: UpdateLaborActionDto,
  ) {
    const laborAction = await this.laborActionsService.update(
      id,
      updateLaborActionDto,
    );

    return {
      succeeded: true,
      data: laborAction,
      message: `Ação trabalhista id: #${laborAction.id} atualizada com sucesso.`,
    };
  }

  @Delete('acoes-trabalhistas/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir uma ação trabalhista',
    description: 'Endpoint responsável por excluir uma ação trabalhista.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ação trabalhista.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para excluir os dados da ação trabalhista',
    type: BaseDeleteDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma mensagem de sucesso caso a exclusão seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Ação trabalhista excluída com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteLaborActionDto: BaseDeleteDto,
  ) {
    await this.laborActionsService.remove(id, deleteLaborActionDto);

    return {
      succeeded: true,
      data: null,
      message: `Ação trabalhista id: #${id} excluída com sucesso.`,
    };
  }
}
