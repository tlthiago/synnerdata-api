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
import { AccidentsService } from './accidents.service';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { UpdateAccidentDto } from './dto/update-accident.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { BaseDeleteDto } from 'src/common/utils/dto/base-delete.dto';
import { AccidentResponseDto } from './dto/accidents-response.dto';

@Controller('v1/funcionarios')
@ApiTags('Acidentes')
export class AccidentsController {
  constructor(private readonly accidentsService: AccidentsService) {}

  @Post(':funcionarioId/acidentes')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar um acidente',
    description: 'Endpoint responsável por cadastrar um acidente.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar o acidente.',
    type: CreateAccidentDto,
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
          description: 'Acidente cadastrado com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('funcionarioId', ParseIntPipe) employeeId: number,
    @Body() createAccidentDto: CreateAccidentDto,
  ) {
    const id = await this.accidentsService.create(
      employeeId,
      createAccidentDto,
    );

    return {
      succeeded: true,
      data: null,
      message: `Acidente cadastrado com sucesso, id: #${id}.`,
    };
  }

  @Get(':funcionarioId/acidentes')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos as acidentes',
    description:
      'Endpoint responsável por listar todos as acidentes cadastrados de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de acidentes em casos de sucesso.',
    type: [AccidentResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseIntPipe) employeeId: number) {
    return this.accidentsService.findAll(employeeId);
  }

  @Get('acidentes/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar acidente',
    description: 'Endpoint responsável por listar dados de um acidente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da acidente.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da acidente em casos de sucesso.',
    type: AccidentResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.accidentsService.findOne(id);
  }

  @Patch('acidentes/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de um acidente',
    description: 'Endpoint responsável por atualizar os dados de um acidente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da acidente.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da acidente',
    type: UpdateAccidentDto,
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
          description: 'Acidente atualizada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccidentDto: UpdateAccidentDto,
  ) {
    await this.accidentsService.update(id, updateAccidentDto);

    return {
      succeeded: true,
      data: null,
      message: `Acidente id: #${id} atualizada com sucesso.`,
    };
  }

  @Delete('acidentes/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir um acidente',
    description: 'Endpoint responsável por excluir um acidente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da acidente.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da acidente',
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
          description: 'Acidente excluído com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteAccidentDto: BaseDeleteDto,
  ) {
    await this.accidentsService.remove(id, deleteAccidentDto);

    return {
      succeeded: true,
      data: null,
      message: `Acidente id: #${id} excluído com sucesso.`,
    };
  }
}
