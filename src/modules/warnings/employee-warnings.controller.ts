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
import { WarningsService } from './warnings.service';
import { CreateWarningDto } from './dto/create-warning.dto';
import { UpdateWarningDto } from './dto/update-warning.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WarningResponseDto } from './dto/warning-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../../common/decorators/dto/current-user.dto';

@Controller('v1/funcionarios')
@ApiTags('Advertências')
export class EmployeeWarningsController {
  constructor(private readonly warningsService: WarningsService) {}

  @Post(':funcionarioId/advertencias')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar uma advertência',
    description: 'Endpoint responsável por cadastrar uma advertência.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar a advertência.',
    type: CreateWarningDto,
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
          description: 'Advertência cadastrada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('funcionarioId', ParseUUIDPipe) employeeId: string,
    @Body() createWarningDto: CreateWarningDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const warning = await this.warningsService.create(
      employeeId,
      createWarningDto,
      user.id,
    );

    return {
      succeeded: true,
      data: warning,
      message: `Advertência cadastrada com sucesso, id: #${warning.id}.`,
    };
  }

  @Get(':funcionarioId/advertencias')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todas as advertências de um funcionário',
    description:
      'Endpoint responsável por listar todas as advertências cadastradas de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de advertências em casos de sucesso.',
    type: [WarningResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseUUIDPipe) employeeId: string) {
    return this.warningsService.findAll(employeeId);
  }

  @Get('advertencias/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar advertência',
    description: 'Endpoint responsável por listar dados de um advertência.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da advertência.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da advertência em casos de sucesso.',
    type: WarningResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.warningsService.findOne(id);
  }

  @Patch('advertencias/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de uma advertência',
    description:
      'Endpoint responsável por atualizar os dados de uma advertência.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da advertência.',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da advertência',
    type: UpdateWarningDto,
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
          description: 'Advertência atualizada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWarningDto: UpdateWarningDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const warning = await this.warningsService.update(
      id,
      updateWarningDto,
      user.id,
    );

    return {
      succeeded: true,
      data: warning,
      message: `Advertência id: #${warning.id} atualizada com sucesso.`,
    };
  }

  @Delete('advertencias/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir uma advertência',
    description: 'Endpoint responsável por excluir uma advertência.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da advertência.',
    type: 'string',
    required: true,
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
          description: 'Advertência excluída com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const warning = await this.warningsService.remove(id, user.id);

    return {
      succeeded: true,
      data: warning,
      message: `Advertência id: #${warning.id} excluída com sucesso.`,
    };
  }
}
