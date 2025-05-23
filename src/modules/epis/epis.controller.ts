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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../../common/decorators/dto/current-user.dto';

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
    type: 'string',
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
    @Param('empresaId', ParseUUIDPipe) companyId: string,
    @Body() createEpiDto: CreateEpiDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const epi = await this.episService.create(companyId, createEpiDto, user.id);

    return {
      succeeded: true,
      data: epi,
      message: `Epi cadastrado com sucesso, id: #${epi.id}.`,
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
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de epis em casos de sucesso.',
    type: [EpiResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseUUIDPipe) companyId: string) {
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
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados do epi em casos de sucesso.',
    type: EpiResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
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
    type: 'string',
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEpiDto: UpdateEpiDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const epi = await this.episService.update(id, updateEpiDto, user.id);

    return {
      succeeded: true,
      data: epi,
      message: `Epi id: #${epi.id} atualizado com sucesso.`,
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
          description: 'Epi excluído com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const epi = await this.episService.remove(id, user.id);

    return {
      succeeded: true,
      data: epi,
      message: `Epi id: #${epi.id} excluído com sucesso.`,
    };
  }
}
