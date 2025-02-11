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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ProjectResponseDto } from './dto/project-response.dto';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';

@Controller('v1/empresas')
@ApiTags('Projetos')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post(':empresaId/projetos')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar um projeto',
    description: 'Endpoint responsável por cadastrar um projeto.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar o projeto.',
    type: CreateProjectDto,
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
          description: 'Projeto cadastrado com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('empresaId', ParseIntPipe) companyId: number,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    const projectId = await this.projectsService.create(
      companyId,
      createProjectDto,
    );

    return {
      succeeded: true,
      data: null,
      message: `Projeto cadastrado com sucesso, id: #${projectId}.`,
    };
  }

  @Get(':empresaId/projetos')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos os projetos',
    description:
      'Endpoint responsável por listar todos os projetos cadastrados de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de projetos em casos de sucesso.',
    type: [ProjectResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseIntPipe) companyId: number) {
    return this.projectsService.findAll(companyId);
  }

  @Get('projetos/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar projeto',
    description: 'Endpoint responsável por listar dados de um projeto.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do projeto.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados do projeto em casos de sucesso.',
    type: ProjectResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Patch('projetos/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de um projeto',
    description: 'Endpoint responsável por atualizar os dados de um projeto.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do projeto.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados do projeto',
    type: UpdateProjectDto,
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
          description: 'Projeto atualizado com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const project = await this.projectsService.update(id, updateProjectDto);

    return {
      succeeded: true,
      data: project,
      message: `Projeto id: #${project.id} atualizado com sucesso.`,
    };
  }

  @Delete('projetos/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir um projeto',
    description: 'Endpoint responsável por excluir um projeto.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do projeto.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados do projeto',
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
          description: 'Projeto excluído com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteProjectDto: BaseDeleteDto,
  ) {
    await this.projectsService.remove(id, deleteProjectDto);

    return {
      succeeded: true,
      data: null,
      message: `Projeto id: #${id} excluído com sucesso.`,
    };
  }
}
