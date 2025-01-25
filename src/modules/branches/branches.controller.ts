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
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { BranchResponseDto } from './dto/branch-response.dto';

@Controller('v1/empresas')
@ApiTags('Filiais')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post(':empresaId/filiais')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar uma filial',
    description: 'Endpoint responsável por cadastrar uma filial.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar a filial.',
    type: CreateBranchDto,
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
          description: 'Filial cadastrada com sucesso',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('empresaId', ParseIntPipe) empresaId: number,
    @Body() createBranchDto: CreateBranchDto,
  ) {
    const id = await this.branchesService.create(+empresaId, createBranchDto);

    return {
      succeeded: true,
      data: null,
      message: `Filial cadastrada com sucesso, id: #${id}.`,
    };
  }

  @Get(':empresaId/filiais')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todas as filiais',
    description:
      'Endpoint responsável por listar todas as filiais cadastradas de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de filiais em casos de sucesso.',
    type: [BranchResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseIntPipe) empresaId: number) {
    return this.branchesService.findAll(+empresaId);
  }

  @Get('filiais/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar filial',
    description: 'Endpoint responsável por listar dados de uma filial.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da filial.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da filial em casos de sucesso.',
    type: BranchResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.branchesService.findOne(+id);
  }

  @Patch('filiais/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de uma filial',
    description: 'Endpoint responsável por atualizar os dados de uma filial.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da filial.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da filial',
    type: UpdateBranchDto,
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
          description: 'Filial atualizada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    await this.branchesService.update(+id, updateBranchDto);

    return {
      succeeded: true,
      data: null,
      message: `Filial id: #${id} atualizada com sucesso.`,
    };
  }

  @Delete('filiais/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir uma filial',
    description: 'Endpoint responsável por excluir uma filial.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da filial.',
    type: 'number',
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
          description: 'Filial excluída com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.branchesService.remove(+id);

    return {
      succeeded: true,
      data: null,
      message: `Filial id: #${id} excluída com sucesso.`,
    };
  }
}
