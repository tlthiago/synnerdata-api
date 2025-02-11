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
import { CbosService } from './cbos.service';
import { CreateCboDto } from './dto/create-cbo.dto';
import { UpdateCboDto } from './dto/update-cbo.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CboResponseDto } from './dto/cbo-response.dto';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';

@Controller('v1/empresas')
@ApiTags('Cbos')
export class CbosController {
  constructor(private readonly cbosService: CbosService) {}

  @Post(':empresaId/cbos')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar um cbo',
    description: 'Endpoint responsável por cadastrar um cbo.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar o cbo.',
    type: CreateCboDto,
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
          description: 'Cbo cadastrado com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('empresaId', ParseIntPipe) companyId: number,
    @Body() createCboDto: CreateCboDto,
  ) {
    const id = await this.cbosService.create(companyId, createCboDto);

    return {
      succeeded: true,
      data: null,
      message: `Cbo cadastrado com sucesso, id: #${id}.`,
    };
  }

  @Get(':empresaId/cbos')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos os cbos',
    description:
      'Endpoint responsável por listar todos os cbos cadastrados de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de cbos em casos de sucesso.',
    type: [CboResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseIntPipe) companyId: number) {
    return this.cbosService.findAll(companyId);
  }

  @Get('cbos/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar cbo',
    description: 'Endpoint responsável por listar dados de um cbo.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do cbo.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados do cbo em casos de sucesso.',
    type: CboResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cbosService.findOne(id);
  }

  @Patch('cbos/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de um cbo',
    description: 'Endpoint responsável por atualizar os dados de um cbo.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do cbo.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados do cbo',
    type: UpdateCboDto,
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
          description: 'Cbo atualizado com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCboDto: UpdateCboDto,
  ) {
    const cbo = await this.cbosService.update(id, updateCboDto);

    return {
      succeeded: true,
      data: cbo,
      message: `Cbo id: #${id} atualizado com sucesso.`,
    };
  }

  @Delete('cbos/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir um cbo',
    description: 'Endpoint responsável por excluir um cbo.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do cbo.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados do cbo',
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
          description: 'Cbo excluído com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteCboDto: BaseDeleteDto,
  ) {
    await this.cbosService.remove(id, deleteCboDto);

    return {
      succeeded: true,
      data: null,
      message: `Cbo id: #${id} excluído com sucesso.`,
    };
  }
}
