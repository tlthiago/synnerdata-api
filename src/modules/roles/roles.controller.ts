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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RoleResponseDto } from './dto/role-response.dto';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';

@Controller('v1/empresas')
@ApiTags('Funções')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post(':empresaId/funcoes')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar uma função',
    description: 'Endpoint responsável por cadastrar uma função.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar a função.',
    type: CreateRoleDto,
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
          description: 'Função cadastrada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('empresaId', ParseIntPipe) companyId: number,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    const id = await this.rolesService.create(companyId, createRoleDto);

    return {
      succeeded: true,
      data: null,
      message: `Função cadastrada com sucesso, id: #${id}.`,
    };
  }

  @Get(':empresaId/funcoes')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todas as funções',
    description:
      'Endpoint responsável por listar todas as funções cadastradas de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de funções em casos de sucesso.',
    type: [RoleResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseIntPipe) companyId: number) {
    return this.rolesService.findAll(companyId);
  }

  @Get('funcoes/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar função',
    description: 'Endpoint responsável por listar dados de um função.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da função.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da função em casos de sucesso.',
    type: RoleResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Patch('funcoes/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de uma função',
    description: 'Endpoint responsável por atualizar os dados de uma função.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da função.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da função',
    type: UpdateRoleDto,
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
          description: 'Função atualizada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const role = await this.rolesService.update(id, updateRoleDto);

    return {
      succeeded: true,
      data: role,
      message: `Função id: #${role.id} atualizada com sucesso.`,
    };
  }

  @Delete('funcoes/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir uma função',
    description: 'Endpoint responsável por excluir uma função.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da função.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da função',
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
          description: 'Função excluída com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteEpiDto: BaseDeleteDto,
  ) {
    await this.rolesService.remove(id, deleteEpiDto);

    return {
      succeeded: true,
      data: null,
      message: `Função id: #${id} excluída com sucesso.`,
    };
  }
}
