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
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';

@Controller('v1/funcionarios')
@ApiTags('Promoções')
export class PromotionController {
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
    type: 'number',
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
    @Param('funcionarioId', ParseIntPipe) employeeId: number,
    @Body() createPromotionDto: CreatePromotionDto,
  ) {
    const promotionId = await this.promotionService.create(
      employeeId,
      createPromotionDto,
    );

    return {
      succeeded: true,
      data: null,
      message: `Promoção cadastrada com sucesso, id: #${promotionId}.`,
    };
  }

  @Get(':funcionarioId/promocoes')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todas as promoções',
    description:
      'Endpoint responsável por listar todos as promoções cadastradas de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de promoções em casos de sucesso.',
    type: [PromotionResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseIntPipe) employeeId: number) {
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
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da promoção em casos de sucesso.',
    type: PromotionResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
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
    type: 'number',
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
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    const promotion = await this.promotionService.update(
      id,
      updatePromotionDto,
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
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da promoção',
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
          description: 'Promoção excluída com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deletePromotionDto: BaseDeleteDto,
  ) {
    await this.promotionService.remove(id, deletePromotionDto);

    return {
      succeeded: true,
      data: null,
      message: `Promoção id: #${id} excluída com sucesso.`,
    };
  }
}
