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
import { LaborActionResponseDto } from './dto/labor-action-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../../common/decorators/dto/current-user.dto';

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
    type: 'string',
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
    @Param('funcionarioId', ParseUUIDPipe) employeeId: string,
    @Body() createLaborActionDto: CreateLaborActionDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const laborAction = await this.laborActionsService.create(
      employeeId,
      createLaborActionDto,
      user.id,
    );

    return {
      succeeded: true,
      data: laborAction,
      message: `Ação trabalhista cadastrada com sucesso, id: #${laborAction.id}.`,
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
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de ações trabalhistas em casos de sucesso.',
    type: [LaborActionResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseUUIDPipe) employeeId: string) {
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
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da ação trabalhista em casos de sucesso.',
    type: LaborActionResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
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
    type: 'string',
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLaborActionDto: UpdateLaborActionDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const laborAction = await this.laborActionsService.update(
      id,
      updateLaborActionDto,
      user.id,
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
    type: 'string',
    required: true,
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
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const laborAction = await this.laborActionsService.remove(id, user.id);

    return {
      succeeded: true,
      data: laborAction,
      message: `Ação trabalhista id: #${laborAction.id} excluída com sucesso.`,
    };
  }
}
