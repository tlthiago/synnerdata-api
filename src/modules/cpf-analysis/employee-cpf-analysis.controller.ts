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
import { CpfAnalysisService } from './cpf-analysis.service';
import { CreateCpfAnalysisDto } from './dto/create-cpf-analysis.dto';
import { UpdateCpfAnalysisDto } from './dto/update-cpf-analysis.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CpfAnalysisResponseDto } from './dto/cpf-analysis-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../../common/decorators/dto/current-user.dto';

@Controller('v1/funcionarios')
@ApiTags('Análise de CPF')
export class EmployeeCpfAnalysisController {
  constructor(private readonly cpfAnalysisService: CpfAnalysisService) {}

  @Post(':funcionarioId/analises-de-cpf')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar uma análise de CPF',
    description: 'Endpoint responsável por cadastrar uma análise de CPF.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar a análise de CPF.',
    type: CreateCpfAnalysisDto,
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
          description: 'Análise de CPF cadastrada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('funcionarioId', ParseUUIDPipe) employeeId: string,
    @Body() createCpfAnalysisDto: CreateCpfAnalysisDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const cpfAnalysis = await this.cpfAnalysisService.create(
      employeeId,
      createCpfAnalysisDto,
      user.id,
    );

    return {
      succeeded: true,
      data: cpfAnalysis,
      message: `Análise de CPF cadastrada com sucesso, id: #${cpfAnalysis.id}.`,
    };
  }

  @Get(':funcionarioId/analises-de-cpf')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todas as análises de cpf de um funcionário',
    description:
      'Endpoint responsável por listar todos as análises de CPF cadastradas de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de análises de CPF em casos de sucesso.',
    type: [CpfAnalysisResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseUUIDPipe) employeeId: string) {
    return this.cpfAnalysisService.findAll(employeeId);
  }

  @Get('analises-de-cpf/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar análise de CPF',
    description: 'Endpoint responsável por listar dados de um análise de CPF.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da análise de CPF.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da análise de CPF em casos de sucesso.',
    type: CpfAnalysisResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cpfAnalysisService.findOne(id);
  }

  @Patch('analises-de-cpf/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de um análise de CPF',
    description:
      'Endpoint responsável por atualizar os dados de um análise de CPF.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da análise de CPF.',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da análise de CPF',
    type: UpdateCpfAnalysisDto,
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
          description: 'Análise de CPF atualizada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCpfAnalysisDto: UpdateCpfAnalysisDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const cpfAnalysis = await this.cpfAnalysisService.update(
      id,
      updateCpfAnalysisDto,
      user.id,
    );

    return {
      succeeded: true,
      data: cpfAnalysis,
      message: `Análise de CPF id: #${cpfAnalysis.id} atualizada com sucesso.`,
    };
  }

  @Delete('analises-de-cpf/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir um análise de CPF',
    description: 'Endpoint responsável por excluir um análise de CPF.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da análise de CPF.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna um mensagem de sucesso caso a exclusão seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Análise de CPF excluída com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const cpfAnalysis = await this.cpfAnalysisService.remove(id, user.id);

    return {
      succeeded: true,
      data: cpfAnalysis,
      message: `Análise de CPF id: #${cpfAnalysis.id} excluída com sucesso.`,
    };
  }
}
