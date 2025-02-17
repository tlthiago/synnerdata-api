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
import { WarningsService } from './warnings.service';
import { CreateWarningDto } from './dto/create-warning.dto';
import { UpdateWarningDto } from './dto/update-warning.dto';
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
import { WarningResponseDto } from './dto/warning-response.dto';

@Controller('v1/funcionarios')
@ApiTags('Advertências')
export class WarningsController {
  constructor(private readonly warningsService: WarningsService) {}

  @Post(':funcionarioId/advertencias')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar uma advertência',
    description: 'Endpoint responsável por cadastrar uma advertência.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar a advertência.',
    type: CreateWarningDto,
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
          description: 'Advertência cadastrada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('funcionarioId', ParseIntPipe) employeeId: number,
    @Body() createWarningDto: CreateWarningDto,
  ) {
    const warningId = await this.warningsService.create(
      employeeId,
      createWarningDto,
    );

    return {
      succeeded: true,
      data: null,
      message: `Advertência cadastrada com sucesso, id: #${warningId}.`,
    };
  }

  @Get(':funcionarioId/advertencias')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todas as advertências',
    description:
      'Endpoint responsável por listar todas as advertências cadastradas de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de advertências em casos de sucesso.',
    type: [WarningResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseIntPipe) employeeId: number) {
    return this.warningsService.findAll(employeeId);
  }

  @Get('advertencias/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar advertência',
    description: 'Endpoint responsável por listar dados de um advertência.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da advertência.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da advertência em casos de sucesso.',
    type: WarningResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.warningsService.findOne(id);
  }

  @Patch('advertencias/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de uma advertência',
    description:
      'Endpoint responsável por atualizar os dados de uma advertência.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da advertência.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da advertência',
    type: UpdateWarningDto,
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
          description: 'Advertência atualizada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWarningDto: UpdateWarningDto,
  ) {
    const warning = await this.warningsService.update(id, updateWarningDto);

    return {
      succeeded: true,
      data: warning,
      message: `Advertência id: #${warning.id} atualizada com sucesso.`,
    };
  }

  @Delete('advertencias/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir uma advertência',
    description: 'Endpoint responsável por excluir uma advertência.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da advertência.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da advertência',
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
          description: 'Advertência excluída com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteWarningDto: BaseDeleteDto,
  ) {
    await this.warningsService.remove(id, deleteWarningDto);

    return {
      succeeded: true,
      data: null,
      message: `Advertência id: #${id} excluída com sucesso.`,
    };
  }
}
