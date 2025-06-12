import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { WarningsService } from './warnings.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WarningResponseDto } from './dto/warning-response.dto';

@Controller('v1/empresas')
@ApiTags('Advertências')
export class WarningsController {
  constructor(private readonly warningsService: WarningsService) {}

  @Get(':empresaId/advertencias')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos as advertências',
    description:
      'Endpoint responsável por listar todas as advertências cadastradas de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de advertências em casos de sucesso.',
    type: [WarningResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseUUIDPipe) companyId: string) {
    return this.warningsService.findAllByCompany(companyId);
  }
}
