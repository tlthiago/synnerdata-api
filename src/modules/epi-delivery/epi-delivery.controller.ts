import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EpiDeliveryService } from './epi-delivery.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { EpiDeliveryResponseDto } from './dto/epi-delivery-response.dto';

@Controller('v1/empresas')
@ApiTags('Entregas de Epis')
export class EpiDeliveryController {
  constructor(private readonly epiDeliveryService: EpiDeliveryService) {}

  @Get(':empresaId/entregas-de-epis')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos as entregas de epis',
    description:
      'Endpoint responsável por listar todas as entregas de epis cadastradas de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de entregas de epi em casos de sucesso.',
    type: [EpiDeliveryResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseUUIDPipe) companyId: string) {
    return this.epiDeliveryService.findAllByCompany(companyId);
  }
}
