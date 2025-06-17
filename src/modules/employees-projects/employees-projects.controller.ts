import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EmployeesProjectsService } from './employees-projects.service';
import { CreateEmployeesProjectDto } from './dto/create-employees-project.dto';
import { UpdateEmployeesProjectDto } from './dto/update-employees-project.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { EmployeeProjectsResponseDto } from './dto/employee-projects-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../../common/decorators/dto/current-user.dto';

@Controller('v1/funcionarios')
@ApiTags('Projetos dos Funcionários')
export class EmployeesProjectsController {
  constructor(
    private readonly employeesProjectsService: EmployeesProjectsService,
  ) {}

  @Post('projetos/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar funcionário(s) em um projeto',
    description:
      'Endpoint responsável por cadastrar funcionário(s) em um projeto.',
  })
  @ApiParam({
    name: 'projetoId',
    description: 'ID do projeto.',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description:
      'Dados necessários para cadastrar o(s) funcionário(s) em um projeto.',
    type: CreateEmployeesProjectDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna um mensagem de sucesso caso a criação seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description:
            'Funcionário(s) cadastrado(s) em um projeto com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('id', ParseUUIDPipe) projectId: string,
    @Body() createEmployeesProjectDto: CreateEmployeesProjectDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const employeesProjects = await this.employeesProjectsService.create(
      projectId,
      createEmployeesProjectDto,
      user.id,
    );

    return {
      succeeded: true,
      data: employeesProjects,
      message: `Funcionário(s) cadastrado(s) com sucesso no projeto, id: #${employeesProjects.id}.`,
    };
  }

  @Get(':funcionarioId/projetos')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos os projetos que o funcionário está cadastrado',
    description:
      'Endpoint responsável por listar todos os projetos em que um funcionário está cadastrado.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de projetos em casos de sucesso.',
    type: [EmployeeProjectsResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseUUIDPipe) employeeId: string) {
    return this.employeesProjectsService.findAll(employeeId);
  }

  @Patch('projetos/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar funcionário(s) em um projeto',
    description:
      'Endpoint responsável por atualizar a lista de funcionário(s) em um projeto.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do projeto.',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description:
      'Dados necessários para atualizar a lista de funcionário(s) em um projeto',
    type: UpdateEmployeesProjectDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna um mensagem de sucesso caso a atualização seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Funcionário(s) do projeto atualizado(s) com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) projectId: string,
    @Body() updateEmployeesProjectDto: UpdateEmployeesProjectDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const employeesProjects = await this.employeesProjectsService.update(
      projectId,
      updateEmployeesProjectDto,
      user.id,
    );

    return {
      succeeded: true,
      data: employeesProjects,
      message: `Funcionário(s) do projeto id: #${employeesProjects.id} atualizado(s) com sucesso.`,
    };
  }
}
