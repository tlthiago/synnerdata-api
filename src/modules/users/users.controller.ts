import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar usuários',
    description:
      'Endpoint responsável por retornar os dados dos usuários cadastrados no sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna todos os usuários cadastrados no sistema.',
    type: [UsersResponseDto],
  })
  async findAll(): Promise<UsersResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar usuário',
    description: 'Endpoint responsável por retornar os dados de um usuário.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um usuário conforme ID informado.',
    type: UsersResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<UsersResponseDto> {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar dados de um usuário',
    description: 'Endpoint responsável por atualizar os dados de um usuário.',
  })
  @ApiBody({
    description: 'Dados necessários para atualizar os dados do usuário',
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
          description: 'Usuário atualizado com sucesso',
        },
      },
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.update(+id, updateUserDto);

    return {
      succeeded: true,
      data: null,
      message: 'Usuário atualizado com sucesso.',
    };
  }
}
