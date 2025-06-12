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
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PromotionResponseDto } from './dto/promotion-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../../common/decorators/dto/current-user.dto';

@Controller('v1/funcionarios')
@ApiTags('Promoções')
export class EmployeePromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post(':funcionarioId/promocoes')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar uma promoção',
    description: 'Endpoint responsável por cadastrar uma promoção.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar a promoção.',
    type: CreatePromotionDto,
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
          description: 'Promoção cadastrada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('funcionarioId', ParseUUIDPipe) employeeId: string,
    @Body() createPromotionDto: CreatePromotionDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const promotion = await this.promotionService.create(
      employeeId,
      createPromotionDto,
      user.id,
    );

    return {
      succeeded: true,
      data: promotion,
      message: `Promoção cadastrada com sucesso, id: #${promotion.id}.`,
    };
  }

  @Get(':funcionarioId/promocoes')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todas as promoções de um funcionário',
    description:
      'Endpoint responsável por listar todas as promoções cadastradas de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de promoções em casos de sucesso.',
    type: [PromotionResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseUUIDPipe) employeeId: string) {
    return this.promotionService.findAll(employeeId);
  }

  @Get('promocoes/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar promoção',
    description: 'Endpoint responsável por listar dados de um promoção.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da promoção.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da promoção em casos de sucesso.',
    type: PromotionResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.promotionService.findOne(id);
  }

  @Patch('promocoes/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de um promoção',
    description: 'Endpoint responsável por atualizar os dados de um promoção.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da promoção.',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da promoção',
    type: UpdatePromotionDto,
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
          description: 'Promoção atualizada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const promotion = await this.promotionService.update(
      id,
      updatePromotionDto,
      user.id,
    );

    return {
      succeeded: true,
      data: promotion,
      message: `Promoção id: #${promotion.id} atualizada com sucesso.`,
    };
  }

  @Delete('promocoes/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir um promoção',
    description: 'Endpoint responsável por excluir um promoção.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da promoção.',
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
          description: 'Promoção excluída com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const promotion = await this.promotionService.remove(id, user.id);

    return {
      succeeded: true,
      data: promotion,
      message: `Promoção id: #${promotion.id} excluída com sucesso.`,
    };
  }
}
