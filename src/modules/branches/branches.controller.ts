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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { BranchResponseDto } from './dto/branch-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../../common/decorators/dto/current-user.dto';

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
    type: 'string',
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
    @Param('empresaId', ParseUUIDPipe) companyId: string,
    @Body() createBranchDto: CreateBranchDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const branch = await this.branchesService.create(
      companyId,
      createBranchDto,
      user.id,
    );

    return {
      succeeded: true,
      data: branch,
      message: `Filial cadastrada com sucesso, id: #${branch.id}.`,
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
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de filiais em casos de sucesso.',
    type: [BranchResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseUUIDPipe) companyId: string) {
    return this.branchesService.findAll(companyId);
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
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da filial em casos de sucesso.',
    type: BranchResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.branchesService.findOne(id);
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
    type: 'string',
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBranchDto: UpdateBranchDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const branch = await this.branchesService.update(
      id,
      updateBranchDto,
      user.id,
    );

    return {
      succeeded: true,
      data: branch,
      message: `Filial id: #${branch.id} atualizada com sucesso.`,
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
          description: 'Filial excluída com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const branch = await this.branchesService.remove(id, user.id);

    return {
      succeeded: true,
      data: branch,
      message: `Filial id: #${id} excluída com sucesso.`,
    };
  }
}
