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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AccidentResponseDto } from './dto/accidents-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../../common/decorators/dto/current-user.dto';

@Controller('v1/funcionarios')
@ApiTags('Acidentes')
export class EmployeeAccidentsController {
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
    type: 'string',
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
    @Param('funcionarioId', ParseUUIDPipe) employeeId: string,
    @Body() createAccidentDto: CreateAccidentDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const accident = await this.accidentsService.create(
      employeeId,
      createAccidentDto,
      user.id,
    );

    return {
      succeeded: true,
      data: accident,
      message: `Acidente cadastrado com sucesso, id: #${accident.id}.`,
    };
  }

  @Get(':funcionarioId/acidentes')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos os acidentes de um funcionário',
    description:
      'Endpoint responsável por listar todos os acidentes cadastrados de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de acidentes em casos de sucesso.',
    type: [AccidentResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAllByCompany(@Param('funcionarioId', ParseUUIDPipe) employeeId: string) {
    return this.accidentsService.findAll(employeeId);
  }

  @Get(':funcionarioId/acidentes')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos os acidentes',
    description:
      'Endpoint responsável por listar todos os acidentes cadastrados de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de acidentes em casos de sucesso.',
    type: [AccidentResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseUUIDPipe) employeeId: string) {
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
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da acidente em casos de sucesso.',
    type: AccidentResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
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
    type: 'string',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados do acidente',
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAccidentDto: UpdateAccidentDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const accident = await this.accidentsService.update(
      id,
      updateAccidentDto,
      user.id,
    );

    return {
      succeeded: true,
      data: accident,
      message: `Acidente id: #${accident.id} atualizado com sucesso.`,
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
          description: 'Acidente excluído com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const accident = await this.accidentsService.remove(id, user.id);

    return {
      succeeded: true,
      data: accident,
      message: `Acidente id: #${accident.id} excluído com sucesso.`,
    };
  }
}
