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
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';
import { CpfAnalysisResponseDto } from './dto/cpf-analysis-response.dto';

@Controller('v1/funcionarios')
@ApiTags('Análise de CPF')
export class CpfAnalysisController {
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
    type: 'number',
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
    @Param('funcionarioId', ParseIntPipe) employeeId: number,
    @Body() createCpfAnalysisDto: CreateCpfAnalysisDto,
  ) {
    const cpfAnalysisId = await this.cpfAnalysisService.create(
      employeeId,
      createCpfAnalysisDto,
    );

    return {
      succeeded: true,
      data: null,
      message: `Análise de CPF cadastrada com sucesso, id: #${cpfAnalysisId}.`,
    };
  }

  @Get(':funcionarioId/analises-de-cpf')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todas as análises de cpf',
    description:
      'Endpoint responsável por listar todos as análises de CPF cadastradas de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de análises de CPF em casos de sucesso.',
    type: [CpfAnalysisResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseIntPipe) employeeId: number) {
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
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da análise de CPF em casos de sucesso.',
    type: CpfAnalysisResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
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
    type: 'number',
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
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCpfAnalysisDto: UpdateCpfAnalysisDto,
  ) {
    const cpfAnalysis = await this.cpfAnalysisService.update(
      id,
      updateCpfAnalysisDto,
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
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da análise de CPF',
    type: BaseDeleteDto,
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
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteCpfAnalysisDto: BaseDeleteDto,
  ) {
    await this.cpfAnalysisService.remove(id, deleteCpfAnalysisDto);

    return {
      succeeded: true,
      data: null,
      message: `Análise de CPF id: #${id} excluída com sucesso.`,
    };
  }
}
