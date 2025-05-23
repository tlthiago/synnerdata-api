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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DepartmentResponseDto } from './dto/department-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../../common/decorators/dto/current-user.dto';

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
    type: 'string',
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
    @Param('empresaId', ParseUUIDPipe) companyId: string,
    @Body() createDepartmentDto: CreateDepartmentDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const department = await this.departmentsService.create(
      companyId,
      createDepartmentDto,
      user.id,
    );

    return {
      succeeded: true,
      data: department,
      message: `Setor cadastrado com sucesso, id: #${department.id}.`,
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
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de setores em casos de sucesso.',
    type: [DepartmentResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseUUIDPipe) companyId: string) {
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
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados do setor em casos de sucesso.',
    type: DepartmentResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
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
    type: 'string',
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const department = await this.departmentsService.update(
      id,
      updateDepartmentDto,
      user.id,
    );

    return {
      succeeded: true,
      data: department,
      message: `Setor id: #${department.id} atualizado com sucesso.`,
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
          description: 'Setor excluído com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const department = await this.departmentsService.remove(id, user.id);

    return {
      succeeded: true,
      data: department,
      message: `Setor id: #${department.id} excluído com sucesso.`,
    };
  }
}
