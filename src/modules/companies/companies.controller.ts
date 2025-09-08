import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyResponseDto } from './dto/company-response.dto';
import { CompanyWithStatsResponseDto } from './dto/company-with-stats-response.dto';
import { CompleteCompanyRegistrationDto } from './dto/complete-company-registration.dto';
import { UpdateCompanyPbUrlDto } from './dto/update-company-pburl.dto';

@Controller('v1/empresas')
@ApiTags('Empresas')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar uma organização',
    description: 'Endpoint responsável por cadastrar uma organização.',
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar a organização.',
    type: CreateCompanyDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma mensagem de sucesso caso a criação seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Empresa cadastrada com sucesso',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    const company = await this.companiesService.create(createCompanyDto);

    return {
      succeeded: true,
      data: company,
      message: `Empresa cadastrada com sucesso, id: #${company.id}.`,
    };
  }

  @Patch(':id/finalizar-cadastro')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Completar o cadastro de uma organização',
    description:
      'Endpoint responsável por completar o cadastro de uma organização.',
  })
  @ApiBody({
    description: 'Dados necessários para completar o cadastro da organização.',
    type: CreateCompanyDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma mensagem de sucesso caso a requisição seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Cadastro da empresa completado com sucesso',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async completeRegistration(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() completeCompanyRegistrationDto: CompleteCompanyRegistrationDto,
  ) {
    const company = await this.companiesService.completeRegistration(
      id,
      completeCompanyRegistrationDto,
    );

    return {
      succeeded: true,
      data: company,
      message: `Cadastro da empresa, id: #${company.id} completado com sucesso.`,
    };
  }

  @Get('estatisticas')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todas as empresas com estatísticas',
    description:
      'Endpoint responsável por listar todas as empresas cadastradas com quantidade de usuários, funcionários e status da assinatura.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma lista de empresas com estatísticas em casos de sucesso.',
    type: [CompanyWithStatsResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAllWithStats() {
    return this.companiesService.findAllWithStats();
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todas as empresas',
    description:
      'Endpoint responsável por listar todas as empresas cadastradas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de empresas em casos de sucesso.',
    type: [CompanyResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar empresa',
    description: 'Endpoint responsável por listar dados de uma empresa.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados de empresas em casos de sucesso.',
    type: CompanyResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de uma empresa',
    description: 'Endpoint responsável por atualizar os dados de uma empresa.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados da empresa',
    type: UpdateCompanyDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma mensagem de sucesso caso a atualização seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Empresa atualizada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const company = await this.companiesService.update(id, updateCompanyDto);

    return {
      succeeded: true,
      data: company,
      message: `Empresa id: #${company.id} atualizada com sucesso.`,
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir uma empresa',
    description: 'Endpoint responsável por excluir uma empresa.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma mensagem de sucesso caso a exclusão seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'Empresa excluída com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const company = await this.companiesService.remove(id);

    return {
      succeeded: true,
      data: company,
      message: `Empresa id: #${company.id} excluída com sucesso.`,
    };
  }

  @Patch(':id/pburl')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar URL do Power BI',
    description: 'Endpoint responsável por cadastrar a URL do Power BI.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar a URL do Power BI',
    type: UpdateCompanyPbUrlDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma mensagem de sucesso caso o cadastro seja bem sucedido.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'URL do Power BI cadastrada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async createPbUrl(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompanyPbUrlDto: UpdateCompanyPbUrlDto,
  ) {
    const company = await this.companiesService.savePbUrl(
      id,
      updateCompanyPbUrlDto.pbUrl,
    );

    return {
      succeeded: true,
      data: company,
      message: `URL do Power BI cadastrada com sucesso.`,
    };
  }

  @Get(':id/pburl')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar URL do Power BI',
    description: 'Endpoint responsável por retornar a URL do Power BI.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna uma mensagem de sucesso caso a busca seja bem sucedida.',
    schema: {
      type: 'object',
      properties: {
        succeeded: { type: 'boolean' },
        data: { type: 'string', nullable: true },
        message: {
          type: 'string',
          description: 'URL do Power BI encontrada com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async findPbUrl(@Param('id', ParseUUIDPipe) id: string) {
    const pbUrl = await this.companiesService.findPbUrl(id);

    return {
      succeeded: true,
      data: pbUrl,
      message: `URL do Power BI encontrada com sucesso.`,
    };
  }
}
