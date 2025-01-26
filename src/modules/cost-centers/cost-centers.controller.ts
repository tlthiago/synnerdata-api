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
import { CostCentersService } from './cost-centers.service';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CostCenterResponseDto } from './dto/cost-center-response.dto';
import { DeleteCostCenterDto } from './dto/delete-cost-center.dto';

@Controller('v1/empresas')
@ApiTags('Centros de custo')
export class CostCentersController {
  constructor(private readonly costCentersService: CostCentersService) {}

  @Post(':empresaId/centros-de-custo')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar um centro de custo',
    description: 'Endpoint responsável por cadastrar um centro de custo.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar o centro de custo.',
    type: CreateCostCenterDto,
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
          description: 'Centro de custo cadastrado com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('empresaId', ParseIntPipe) companyId: number,
    @Body() createCostCenterDto: CreateCostCenterDto,
  ) {
    const id = await this.costCentersService.create(
      companyId,
      createCostCenterDto,
    );

    return {
      succeeded: true,
      data: null,
      message: `Centro de custo cadastrado com sucesso, id: #${id}.`,
    };
  }

  @Get(':empresaId/centros-de-custo')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos os centros de custo',
    description:
      'Endpoint responsável por listar todos os centros de custo cadastrados de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de centros de custo em casos de sucesso.',
    type: [CostCenterResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseIntPipe) companyId: number) {
    return this.costCentersService.findAll(companyId);
  }

  @Get('centros-de-custo/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar centro de custo',
    description: 'Endpoint responsável por listar dados de um centro de custo.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do centro de custo.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados do centro de custo em casos de sucesso.',
    type: CostCenterResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.costCentersService.findOne(id);
  }

  @Patch('centros-de-custo/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de um centro de custo',
    description:
      'Endpoint responsável por atualizar os dados de um centro de custo.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do centro de custo.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados do centro de custo',
    type: UpdateCostCenterDto,
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
          description: 'Centros de custo atualizado com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCostCenterDto: UpdateCostCenterDto,
  ) {
    await this.costCentersService.update(id, updateCostCenterDto);

    return {
      succeeded: true,
      data: null,
      message: `Centro de custo id: #${id} atualizado com sucesso.`,
    };
  }

  @Delete('centros-de-custo/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir um centro de custo',
    description: 'Endpoint responsável por excluir um centro de custo.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do centro de custo.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados do centro de custo',
    type: DeleteCostCenterDto,
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
          description: 'Centro de custo excluído com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteCostCenterDto: DeleteCostCenterDto,
  ) {
    await this.costCentersService.remove(id, deleteCostCenterDto);

    return {
      succeeded: true,
      data: null,
      message: `Centro de custo id: #${id} excluído com sucesso.`,
    };
  }
}
