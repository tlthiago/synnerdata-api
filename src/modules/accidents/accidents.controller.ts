import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AccidentsService } from './accidents.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AccidentResponseDto } from './dto/accidents-response.dto';

@Controller('v1/empresas')
@ApiTags('Acidentes')
export class AccidentsController {
  constructor(private readonly accidentsService: AccidentsService) {}

  @Get(':empresaId/acidentes')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos os acidentes',
    description:
      'Endpoint responsável por listar todos os acidentes cadastrados de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de acidentes em casos de sucesso.',
    type: [AccidentResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseUUIDPipe) companyId: string) {
    return this.accidentsService.findAllByCompany(companyId);
  }
}
