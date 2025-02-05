import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('v1/empresas')
@ApiTags('Funcionários')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post(':empresaId/funcionarios')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar um funcionário',
    description: 'Endpoint responsável por cadastrar um funcionário.',
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar um funcionario.',
    type: CreateEmployeeDto,
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
          description: 'Funcionários cadastrado com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('empresaId', ParseIntPipe) companyId: number,
    @Body() createEmployeeDto: CreateEmployeeDto,
  ) {
    const id = await this.employeesService.create(companyId, createEmployeeDto);
    return {
      succeeded: true,
      data: null,
      message: `Funcionário cadastrado com sucesso, id: #${id}.`,
    };
  }

  @Get(':empresaId/funcionarios')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos os Funcionários',
    description:
      'Endpoint responsável por listar todos os Funcionários cadastrados de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de Funcionários em casos de sucesso.',
    type: [CreateEmployeeDto],
  })
  findAll(@Param('empresaId', ParseIntPipe) companyId: number) {
    return this.employeesService.findAll(companyId);
  }

  @Get('funcionarios/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar Funcionário',
    description: 'Endpoint responsável por listar dados de um Funcionário.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do Funcionario.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados do funcionário em casos de sucesso.',
    type: CreateEmployeeDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Patch('funcionarios/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de um Funcionário',
    description:
      'Endpoint responsável por atualizar os dados de um funcionário.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do funcionario.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados do funcionario',
    type: UpdateEmployeeDto,
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
          description: 'Funcionário atualizado com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
}
