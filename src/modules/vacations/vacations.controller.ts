import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { VacationsService } from './vacations.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { VacationResponseDto } from './dto/vacation-response.dto';

@Controller('v1/empresas')
@ApiTags('Férias')
export class VacationsController {
  constructor(private readonly vacationsService: VacationsService) {}

  @Get(':empresaId/ferias')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos as férias',
    description:
      'Endpoint responsável por listar todas as férias cadastradas de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de férias em casos de sucesso.',
    type: [VacationResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseUUIDPipe) companyId: string) {
    return this.vacationsService.findAllByCompany(companyId);
  }
}
