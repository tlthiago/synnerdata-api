import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

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
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'number',
    required: true,
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
    const employeeId = await this.employeesService.create(
      companyId,
      createEmployeeDto,
    );
    return {
      succeeded: true,
      data: null,
      message: `Funcionário cadastrado com sucesso, id: #${employeeId}.`,
    };
  }

  @Get(':empresaId/funcionarios')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos os funcionários',
    description:
      'Endpoint responsável por listar todos os funcionários cadastrados de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de funcionários em casos de sucesso.',
    type: [CreateEmployeeDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseIntPipe) companyId: number) {
    return this.employeesService.findAll(companyId);
  }

  @Get('funcionarios/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar funcionário',
    description: 'Endpoint responsável por listar dados de um funcionário.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados do funcionário em casos de sucesso.',
    type: CreateEmployeeDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Patch('funcionarios/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de um funcionário',
    description:
      'Endpoint responsável por atualizar os dados de um funcionário.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados do funcionário',
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    const employee = await this.employeesService.update(id, updateEmployeeDto);

    return {
      succeeded: true,
      data: employee,
      message: `Funcionário id: #${employee.id} atualizado com sucesso.`,
    };
  }
}
