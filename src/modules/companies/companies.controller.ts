import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyResponseDto } from './dto/company-response.dto';

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
    await this.companiesService.create(createCompanyDto);

    return {
      succeeded: true,
      data: null,
      message: 'Empresa cadastrada com sucesso.',
    };
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
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados de empresas em casos de sucesso.',
    type: CompanyResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
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
    type: 'number',
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
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    await this.companiesService.update(+id, updateCompanyDto);

    return {
      succeeded: true,
      data: null,
      message: 'Empresa atualizada com sucesso.',
    };
  }
}
