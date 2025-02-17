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
import { VacationsService } from './vacations.service';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
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
import { VacationResponseDto } from './dto/vacation-response.dto';

@Controller('v1/funcionarios')
@ApiTags('Férias')
export class VacationsController {
  constructor(private readonly vacationsService: VacationsService) {}

  @Post(':funcionarioId/ferias')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar uma férias',
    description: 'Endpoint responsável por cadastrar uma férias.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar a férias.',
    type: CreateVacationDto,
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
          description: 'Férias cadastrada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('funcionarioId', ParseIntPipe) employeeId: number,
    @Body() createVacationDto: CreateVacationDto,
  ) {
    const vacationId = await this.vacationsService.create(
      employeeId,
      createVacationDto,
    );

    return {
      succeeded: true,
      data: null,
      message: `Férias cadastrada com sucesso, id: #${vacationId}.`,
    };
  }

  @Get(':funcionarioId/ferias')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todas as férias',
    description:
      'Endpoint responsável por listar todas as férias cadastradas de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de férias em casos de sucesso.',
    type: [VacationResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseIntPipe) employeeId: number) {
    return this.vacationsService.findAll(employeeId);
  }

  @Get('ferias/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar férias',
    description: 'Endpoint responsável por listar dados de um férias.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da férias.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da férias em casos de sucesso.',
    type: VacationResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vacationsService.findOne(id);
  }

  @Patch('ferias/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de uma férias',
    description: 'Endpoint responsável por atualizar os dados de uma férias.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da férias.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da férias',
    type: UpdateVacationDto,
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
          description: 'Férias atualizada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVacationDto: UpdateVacationDto,
  ) {
    const vacation = await this.vacationsService.update(id, updateVacationDto);

    return {
      succeeded: true,
      data: vacation,
      message: `Férias id: #${vacation.id} atualizada com sucesso.`,
    };
  }

  @Delete('ferias/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir uma férias',
    description: 'Endpoint responsável por excluir uma férias.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da férias.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da férias',
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
          description: 'Férias excluída com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteVacationDto: BaseDeleteDto,
  ) {
    await this.vacationsService.remove(id, deleteVacationDto);

    return {
      succeeded: true,
      data: null,
      message: `Férias id: #${id} excluída com sucesso.`,
    };
  }
}
