import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
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
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';

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
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UsersResponseDto> {
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.update(+id, updateUserDto);

    return {
      succeeded: true,
      data: null,
      message: 'Usuário atualizado com sucesso.',
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir um usuário',
    description: 'Endpoint responsável por excluir um usuário.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da filial.',
    type: 'number',
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
          description: 'Usuário excluído com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteUserDto: BaseDeleteDto,
  ) {
    await this.userService.remove(+id, deleteUserDto);

    return {
      succeeded: true,
      data: null,
      message: `Usuário id: #${id} excluído com sucesso.`,
    };
  }
}
