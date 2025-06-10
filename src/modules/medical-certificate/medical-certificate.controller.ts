import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MedicalCertificateService } from './medical-certificate.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { MedicalCertificateResponseDto } from './dto/medical-certificate-response.dto';

@Controller('v1/empresas')
@ApiTags('Atestados')
export class MedicalCertificateController {
  constructor(
    private readonly medicalCertificateService: MedicalCertificateService,
  ) {}

  @Get(':empresaId/atestados')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos os atestados',
    description:
      'Endpoint responsável por listar todos os atestados cadastrados de uma empresa.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de atestados em casos de sucesso.',
    type: [MedicalCertificateResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('empresaId', ParseUUIDPipe) companyId: string) {
    return this.medicalCertificateService.findAllByCompany(companyId);
  }
}
