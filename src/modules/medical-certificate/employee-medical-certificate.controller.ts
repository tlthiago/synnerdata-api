import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MedicalCertificateService } from './medical-certificate.service';
import { CreateMedicalCertificateDto } from './dto/create-medical-certificate.dto';
import { UpdateMedicalCertificateDto } from './dto/update-medical-certificate.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { MedicalCertificateResponseDto } from './dto/medical-certificate-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../../common/decorators/dto/current-user.dto';

@Controller('v1/funcionarios')
@ApiTags('Atestados')
export class EmployeeMedicalCertificateController {
  constructor(
    private readonly medicalCertificateService: MedicalCertificateService,
  ) {}

  @Post(':funcionarioId/atestados')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar um atestado',
    description: 'Endpoint responsável por cadastrar um atestado.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar o atestado.',
    type: CreateMedicalCertificateDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna um mensagem de sucesso caso a criação seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Atestado cadastrado com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('funcionarioId', ParseUUIDPipe) employeeId: string,
    @Body() createMedicalCertificateDto: CreateMedicalCertificateDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const medicalCertificate = await this.medicalCertificateService.create(
      employeeId,
      createMedicalCertificateDto,
      user.id,
    );

    return {
      succeeded: true,
      data: medicalCertificate,
      message: `Atestado cadastrado com sucesso, id: #${medicalCertificate.id}.`,
    };
  }

  @Get(':funcionarioId/atestados')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos os atestados',
    description:
      'Endpoint responsável por listar todos os atestados cadastrados de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de atestados em casos de sucesso.',
    type: [MedicalCertificateResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseUUIDPipe) employeeId: string) {
    return this.medicalCertificateService.findAll(employeeId);
  }

  @Get('atestados/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar atestado',
    description: 'Endpoint responsável por listar dados de um atestado.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da atestado.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da atestado em casos de sucesso.',
    type: MedicalCertificateResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.medicalCertificateService.findOne(id);
  }

  @Patch('atestados/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de um atestado',
    description: 'Endpoint responsável por atualizar os dados de um atestado.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da atestado.',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da atestado',
    type: UpdateMedicalCertificateDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna um mensagem de sucesso caso a atualização seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Atestado atualizada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMedicalCertificateDto: UpdateMedicalCertificateDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const medicalCertificate = await this.medicalCertificateService.update(
      id,
      updateMedicalCertificateDto,
      user.id,
    );

    return {
      succeeded: true,
      data: medicalCertificate,
      message: `Atestado id: #${medicalCertificate.id} atualizada com sucesso.`,
    };
  }

  @Delete('atestados/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir um atestado',
    description: 'Endpoint responsável por excluir um atestado.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da atestado.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna um mensagem de sucesso caso a exclusão seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Atestado excluído com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const medicalCertificate = await this.medicalCertificateService.remove(
      id,
      user.id,
    );

    return {
      succeeded: true,
      data: medicalCertificate,
      message: `Atestado id: #${medicalCertificate.id} excluído com sucesso.`,
    };
  }
}
