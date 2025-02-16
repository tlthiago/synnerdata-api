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
import { TerminationsService } from './terminations.service';
import { CreateTerminationDto } from './dto/create-termination.dto';
import { UpdateTerminationDto } from './dto/update-termination.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TerminationResponseDto } from './dto/termination-response.dto';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';

@Controller('v1/funcionarios')
@ApiTags('Demissões')
export class TerminationsController {
  constructor(private readonly terminationsService: TerminationsService) {}

  @Post(':funcionarioId/demissoes')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar uma demissão',
    description: 'Endpoint responsável por cadastrar uma demissão.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar a demissão.',
    type: CreateTerminationDto,
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
          description: 'Demissão cadastrada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('funcionarioId', ParseIntPipe) employeeId: number,
    @Body() createTerminationDto: CreateTerminationDto,
  ) {
    const terminationId = await this.terminationsService.create(
      employeeId,
      createTerminationDto,
    );

    return {
      succeeded: true,
      data: null,
      message: `Demissão cadastrada com sucesso, id: #${terminationId}.`,
    };
  }

  @Get(':funcionarioId/demissoes')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todas as demissões',
    description:
      'Endpoint responsável por listar todos as demissões cadastradas de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de demissões em casos de sucesso.',
    type: [TerminationResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseIntPipe) employeeId: number) {
    return this.terminationsService.findAll(employeeId);
  }

  @Get('demissoes/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar demissão',
    description: 'Endpoint responsável por listar dados de um demissão.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da demissão.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da demissão em casos de sucesso.',
    type: TerminationResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.terminationsService.findOne(id);
  }

  @Patch('demissoes/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de um demissão',
    description: 'Endpoint responsável por atualizar os dados de um demissão.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da demissão.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da demissão',
    type: UpdateTerminationDto,
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
          description: 'Demissão atualizada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTerminationDto: UpdateTerminationDto,
  ) {
    const termination = await this.terminationsService.update(
      id,
      updateTerminationDto,
    );

    return {
      succeeded: true,
      data: termination,
      message: `Demissão id: #${termination.id} atualizada com sucesso.`,
    };
  }

  @Delete('demissoes/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir um demissão',
    description: 'Endpoint responsável por excluir um demissão.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da demissão.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da demissão',
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
          description: 'Demissão excluída com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteTerminationDto: BaseDeleteDto,
  ) {
    await this.terminationsService.remove(id, deleteTerminationDto);

    return {
      succeeded: true,
      data: null,
      message: `Demissão id: #${id} excluída com sucesso.`,
    };
  }
}
