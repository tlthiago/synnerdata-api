import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AbsenceService } from './absence.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AbsenceResponseDto } from './dto/absence-response.dto';

@Controller('v1/empresas')
@ApiTags('Faltas')
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) {}

  @Get(':empresaId/faltas')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos as faltas',
    description:
      'Endpoint responsável por listar todas as faltas cadastradas de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de faltas em casos de sucesso.',
    type: [AbsenceResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseUUIDPipe) companyId: string) {
    return this.absenceService.findAllByCompany(companyId);
  }
}
