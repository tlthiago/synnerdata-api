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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { DepartmentResponseDto } from './dto/department-response.dto';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';

@Controller('v1/empresas')
@ApiTags('Setores')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post(':empresaId/setores')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar um setor',
    description: 'Endpoint responsável por cadastrar um setor.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar o setor.',
    type: CreateDepartmentDto,
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
          description: 'Setor cadastrado com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('empresaId', ParseIntPipe) companyId: number,
    @Body() createDepartmentDto: CreateDepartmentDto,
  ) {
    const id = await this.departmentsService.create(
      companyId,
      createDepartmentDto,
    );

    return {
      succeeded: true,
      data: null,
      message: `Setor cadastrado com sucesso, id: #${id}.`,
    };
  }

  @Get(':empresaId/setores')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos os setores',
    description:
      'Endpoint responsável por listar todos os setores cadastrados de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de setores em casos de sucesso.',
    type: [DepartmentResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseIntPipe) companyId: number) {
    return this.departmentsService.findAll(companyId);
  }

  @Get('setores/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar setor',
    description: 'Endpoint responsável por listar dados de um departamento.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do setor.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados do setor em casos de sucesso.',
    type: DepartmentResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne(id);
  }

  @Patch('setores/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de um setor',
    description: 'Endpoint responsável por atualizar os dados de um setor.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do setor.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados do setor',
    type: UpdateDepartmentDto,
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
          description: 'Setor atualizado com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    await this.departmentsService.update(id, updateDepartmentDto);

    return {
      succeeded: true,
      data: null,
      message: `Setor id: #${id} atualizado com sucesso.`,
    };
  }

  @Delete('setores/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir um setor',
    description: 'Endpoint responsável por excluir um setor.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do setor.',
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
          description: 'Setor excluído com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteDepartmentDto: BaseDeleteDto,
  ) {
    await this.departmentsService.remove(id, deleteDepartmentDto);

    return {
      succeeded: true,
      data: null,
      message: `Setor id: #${id} excluído com sucesso.`,
    };
  }
}
