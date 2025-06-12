import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TerminationsService } from './terminations.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TerminationResponseDto } from './dto/termination-response.dto';

@Controller('v1/empresas')
@ApiTags('Demissões')
export class TerminationsController {
  constructor(private readonly terminationsService: TerminationsService) {}

  @Get(':empresaId/demissoes')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos as demissões',
    description:
      'Endpoint responsável por listar todas as demissões cadastradas de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de demissões em casos de sucesso.',
    type: [TerminationResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseUUIDPipe) companyId: string) {
    return this.terminationsService.findAllByCompany(companyId);
  }
}
