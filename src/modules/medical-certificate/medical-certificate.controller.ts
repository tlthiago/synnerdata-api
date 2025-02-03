import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { MedicalCertificateService } from './medical-certificate.service';
import { CreateMedicalCertificateDto } from './dto/create-medical-certificate.dto';
import { UpdateMedicalCertificateDto } from './dto/update-medical-certificate.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { MedicalCertificateResponseDto } from './dto/medical-certificate-response.dto';
import { BaseDeleteDto } from 'src/common/utils/dto/base-delete.dto';

@Controller('v1/funcionarios')
@ApiTags('Atestados')
export class MedicalCertificateController {
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
    type: 'number',
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
    @Param('funcionarioId', ParseIntPipe) employeeId: number,
    @Body() createMedicalCertificateDto: CreateMedicalCertificateDto,
  ) {
    const id = await this.medicalCertificateService.create(employeeId, createMedicalCertificateDto);

    return {
      succeeded: true,
      data: null,
      message: `Atestado cadastrado com sucesso, id: #${id}.`,
    };
  }

  @Get(':funcionarioId/atestados')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos as atestados',
    description:
      'Endpoint responsável por listar todos as atestados cadastrados de um funcionário.',
  })
  @ApiParam({
    name: 'funcionarioId',
    description: 'ID do funcionário.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um lista de atestados em casos de sucesso.',
    type: [MedicalCertificateResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('funcionarioId', ParseIntPipe) employeeId: number) {
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
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados da atestado em casos de sucesso.',
    type: MedicalCertificateResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
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
    type: 'number',
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
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMedicalCertificateDto: UpdateMedicalCertificateDto,
  ) {
    await this.medicalCertificateService.update(id, updateMedicalCertificateDto);

    return {
      succeeded: true,
      data: null,
      message: `Atestado id: #${id} atualizada com sucesso.`,
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
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da atestado',
    type: BaseDeleteDto,
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
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteMedicalCertificateDto: BaseDeleteDto,
  ) {
    await this.medicalCertificateService.remove(id, deleteMedicalCertificateDto);

    return {
      succeeded: true,
      data: null,
      message: `Atestado id: #${id} excluído com sucesso.`,
    };
  }
}
