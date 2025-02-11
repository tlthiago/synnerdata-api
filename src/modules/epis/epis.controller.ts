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
import { EpisService } from './epis.service';
import { CreateEpiDto } from './dto/create-epi.dto';
import { UpdateEpiDto } from './dto/update-epi.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { EpiResponseDto } from './dto/epi-response.dto';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';

@Controller('v1/empresas')
@ApiTags('Epis')
export class EpisController {
  constructor(private readonly episService: EpisService) {}

  @Post(':empresaId/epis')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar um epi',
    description: 'Endpoint responsável por cadastrar um epi.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar o epi.',
    type: CreateEpiDto,
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
          description: 'Epi cadastrado com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('empresaId', ParseIntPipe) companyId: number,
    @Body() createEpiDto: CreateEpiDto,
  ) {
    const id = await this.episService.create(companyId, createEpiDto);

    return {
      succeeded: true,
      data: null,
      message: `Epi cadastrado com sucesso, id: #${id}.`,
    };
  }

  @Get(':empresaId/epis')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos os epis',
    description:
      'Endpoint responsável por listar todos os epis cadastrados de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de epis em casos de sucesso.',
    type: [EpiResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseIntPipe) companyId: number) {
    return this.episService.findAll(companyId);
  }

  @Get('epis/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar epi',
    description: 'Endpoint responsável por listar dados de um epi.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do epi.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados do epi em casos de sucesso.',
    type: EpiResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.episService.findOne(id);
  }

  @Patch('epis/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de um epi',
    description: 'Endpoint responsável por atualizar os dados de um epi.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do epi.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados do epi',
    type: UpdateEpiDto,
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
          description: 'Epi atualizado com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEpiDto: UpdateEpiDto,
  ) {
    await this.episService.update(id, updateEpiDto);

    return {
      succeeded: true,
      data: null,
      message: `Epi id: #${id} atualizado com sucesso.`,
    };
  }

  @Delete('epis/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir um epi',
    description: 'Endpoint responsável por excluir um epi.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do epi.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados do epi',
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
          description: 'Epi excluído com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteEpiDto: BaseDeleteDto,
  ) {
    await this.episService.remove(id, deleteEpiDto);

    return {
      succeeded: true,
      data: null,
      message: `Epi id: #${id} excluído com sucesso.`,
    };
  }
}
