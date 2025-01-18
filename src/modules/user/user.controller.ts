import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  // Delete,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Cadastrar usuário',
    description: 'Endpoint responsável por cadastrar um usuário.',
  })
  @ApiBody({
    description: 'Dados necessários para cadastrar o usuário',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário cadastrado com sucesso.',
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Buscar usuários',
    description:
      'Endpoint responsável por retornar os dados dos usuários cadastrados no sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna todos os usuários cadastrados no sistema.',
    type: [UserResponseDto],
  })
  async findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar usuário',
    description: 'Endpoint responsável por retornar os dados de um usuário.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um usuário conforme ID informado.',
    type: UserResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }
}
