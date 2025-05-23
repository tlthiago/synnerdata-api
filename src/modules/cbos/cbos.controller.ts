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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../../common/decorators/dto/current-user.dto';

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
    type: 'string',
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
    @Param('empresaId', ParseUUIDPipe) companyId: string,
    @Body() createCboDto: CreateCboDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const cbo = await this.cbosService.create(companyId, createCboDto, user.id);

    return {
      succeeded: true,
      data: cbo,
      message: `Cbo cadastrado com sucesso, id: #${cbo.id}.`,
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
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de cbos em casos de sucesso.',
    type: [CboResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseUUIDPipe) companyId: string) {
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
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados do cbo em casos de sucesso.',
    type: CboResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
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
    type: 'string',
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCboDto: UpdateCboDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const cbo = await this.cbosService.update(id, updateCboDto, user.id);

    return {
      succeeded: true,
      data: cbo,
      message: `Cbo id: #${cbo.id} atualizado com sucesso.`,
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
          description: 'Cbo excluído com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const cbo = await this.cbosService.remove(id, user.id);

    return {
      succeeded: true,
      data: cbo,
      message: `Cbo id: #${cbo.id} excluído com sucesso.`,
    };
  }
}
