import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadInterceptor } from './interceptors/file-upload.interceptor';
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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../../common/decorators/dto/current-user.dto';

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
    type: 'string',
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
    @Param('empresaId', ParseUUIDPipe) companyId: string,
    @Body() createEmployeeDto: CreateEmployeeDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const employee = await this.employeesService.create(
      companyId,
      createEmployeeDto,
      user.id,
    );

    return {
      succeeded: true,
      data: employee,
      message: `Funcionário cadastrado com sucesso, id: #${employee.id}.`,
    };
  }

  @Post(':empresaId/funcionarios/importar')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Importar funcionários via Excel',
    description:
      'Endpoint responsável por importar funcionários através de arquivo Excel (.xlsx).',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um resumo da importação em caso de sucesso.',
    schema: {
      type: 'object',
      properties: {
        totalRows: { type: 'number' },
        inserted: { type: 'number' },
        skipped: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Retorna erros de validação.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              row: { type: 'number' },
              field: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'), FileUploadInterceptor)
  async importEmployees(
    @Param('empresaId', ParseUUIDPipe) companyId: string,
    @UploadedFile() file: any,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const result = await this.employeesService.importXlsx(
      companyId,
      file.buffer,
      user.id,
    );
    return result;
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
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de funcionários em casos de sucesso.',
    type: [CreateEmployeeDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseUUIDPipe) companyId: string) {
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
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados do funcionário em casos de sucesso.',
    type: CreateEmployeeDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
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
    type: 'string',
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const employee = await this.employeesService.update(
      id,
      updateEmployeeDto,
      user.id,
    );

    return {
      succeeded: true,
      data: employee,
      message: `Funcionário id: #${employee.id} atualizado com sucesso.`,
    };
  }

  @Delete('funcionarios/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir um funcionário',
    description: 'Endpoint responsável por excluir um funcionário.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do funcionário.',
    type: 'string',
    required: true,
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
          description: 'Funcionário excluído com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const employee = await this.employeesService.remove(id, user.id);

    return {
      succeeded: true,
      data: employee,
      message: `Funcionário id: #${employee.id} excluído com sucesso.`,
    };
  }
}
