import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { LaborActionsService } from './labor-actions.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LaborActionResponseDto } from './dto/labor-action-response.dto';

@Controller('v1/empresas')
@ApiTags('Ações Trabalhistas')
export class LaborActionsController {
  constructor(private readonly laborActionsService: LaborActionsService) {}

  @Get(':empresaId/acoes-trabalhistas')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos as ações trabalhistas',
    description:
      'Endpoint responsável por listar todas as ações trabalhistas cadastradas de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de ações trabalhistas em casos de sucesso.',
    type: [LaborActionResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseUUIDPipe) companyId: string) {
    return this.laborActionsService.findAllByCompany(companyId);
  }
}
