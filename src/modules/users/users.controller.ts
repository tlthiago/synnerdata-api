import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
  ParseUUIDPipe,
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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserDto } from '../../common/decorators/dto/current-user.dto';

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
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('empresa/:empresaId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar todos os usuários de uma organização',
    description:
      'Endpoint responsável por retornar os dados dos usuários cadastrados em uma organização.',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa.',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna todos os usuários cadastrados em uma organização.',
    type: [UsersResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  async findAllByCompany(@Param('empresaId', ParseUUIDPipe) companyId: string) {
    return await this.userService.findAllByCompany(companyId);
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
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um usuário conforme ID informado.',
    type: UsersResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.findOne(id);
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
    type: 'string',
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const updatedUser = await this.userService.update(
      id,
      updateUserDto,
      user.id,
    );

    return {
      succeeded: true,
      data: updatedUser,
      message: `Usuário id: #${updatedUser.id} atualizado com sucesso.`,
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
          description: 'Usuário excluído com sucesso.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const removedUser = await this.userService.remove(id, user.id);

    return {
      succeeded: true,
      data: removedUser,
      message: `Usuário id: #${removedUser.id} excluído com sucesso.`,
    };
  }
}
