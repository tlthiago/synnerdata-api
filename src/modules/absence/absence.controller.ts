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
import { AbsenceService } from './absence.service';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AbsenceResponseDto } from './dto/absence-response.dto';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';

@Controller('v1/funcionarios')
@ApiTags('Faltas')
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) {}

  @Post(':funcionarioId/faltas')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar uma falta',
    description: 'Endpoint responsável por cadastrar uma falta.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar a falta.',
    type: CreateAbsenceDto,
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
          description: 'Falta cadastrada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('funcionarioId', ParseIntPipe) employeeId: number,
    @Body() createAbsenceDto: CreateAbsenceDto,
  ) {
    const id = await this.absenceService.create(employeeId, createAbsenceDto);

    return {
      succeeded: true,
      data: null,
      message: `Falta cadastrada com sucesso, id: #${id}.`,
    };
  }

  @Get(':funcionarioId/faltas')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todas as faltas',
    description:
      'Endpoint responsável por listar todas as faltas cadastradas de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de faltas em casos de sucesso.',
    type: [AbsenceResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseIntPipe) employeeId: number) {
    return this.absenceService.findAll(employeeId);
  }

  @Get('faltas/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar falta',
    description: 'Endpoint responsável por listar dados de um falta.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da falta.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da falta em casos de sucesso.',
    type: AbsenceResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.absenceService.findOne(id);
  }

  @Patch('faltas/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de uma falta',
    description: 'Endpoint responsável por atualizar os dados de uma falta.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da falta.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da falta',
    type: UpdateAbsenceDto,
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
          description: 'Falta atualizada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAbsenceDto: UpdateAbsenceDto,
  ) {
    const absence = await this.absenceService.update(id, updateAbsenceDto);

    return {
      succeeded: true,
      data: absence,
      message: `Falta id: #${absence.id} atualizada com sucesso.`,
    };
  }

  @Delete('faltas/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir uma falta',
    description: 'Endpoint responsável por excluir uma falta.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da falta.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da falta',
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
          description: 'Falta excluída com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteAbsenceDto: BaseDeleteDto,
  ) {
    await this.absenceService.remove(id, deleteAbsenceDto);

    return {
      succeeded: true,
      data: null,
      message: `Falta id: #${id} excluída com sucesso.`,
    };
  }
}
