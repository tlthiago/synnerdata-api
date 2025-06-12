import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PromotionResponseDto } from './dto/promotion-response.dto';

@Controller('v1/empresas')
@ApiTags('Promoções')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Get(':empresaId/promocoes')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todas as promoções',
    description:
      'Endpoint responsável por listar todas as promoções cadastradas de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de promoções em casos de sucesso.',
    type: [PromotionResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseUUIDPipe) companyId: string) {
    return this.promotionService.findAllByCompany(companyId);
  }
}
