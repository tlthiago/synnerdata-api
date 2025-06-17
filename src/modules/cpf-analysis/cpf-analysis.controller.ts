import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CpfAnalysisService } from './cpf-analysis.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CpfAnalysisResponseDto } from './dto/cpf-analysis-response.dto';

@Controller('v1/empresas')
@ApiTags('Análise de CPF')
export class CpfAnalysisController {
  constructor(private readonly cpfAnalysisService: CpfAnalysisService) {}

  @Get(':empresaId/analises-de-cpf')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos as análises de cpf',
    description:
      'Endpoint responsável por listar todas as análises de cpf cadastradas de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de análises de cpf em casos de sucesso.',
    type: [CpfAnalysisResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseUUIDPipe) companyId: string) {
    return this.cpfAnalysisService.findAllByCompany(companyId);
  }
}
