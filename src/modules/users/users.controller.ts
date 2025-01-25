import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('v1/usuarios')
@ApiTags('Usuários')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos os usuários',
    description:
      'Endpoint responsável por retornar os dados dos usuários cadastrados no sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna todos os usuários cadastrados no sistema.',
    type: [UsersResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<UsersResponseDto[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar usuário',
    description: 'Endpoint responsável por retornar os dados de um usuário.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário.',
    type: 'number',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um usuário conforme ID informado.',
    type: UsersResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<UsersResponseDto> {
    return await this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de um usuário',
    description: 'Endpoint responsável por atualizar os dados de um usuário.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário.',
    type: 'number',
    required: true,
  })
  @ApiBody({
    description: 'Dados disponíveis para atualização do usuário',
    type: UpdateUserDto,
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
          description: 'Usuário atualizado com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.update(+id, updateUserDto);

    return {
      succeeded: true,
      data: null,
      message: 'Usuário atualizado com sucesso.',
    };
  }
}
