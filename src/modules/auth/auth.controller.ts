import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
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
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('sign-in')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({
    summary: 'Autenticar usuário',
    description: 'Endpoint responsável por autenticar o usuário.',
  })
  @ApiBody({
    description: 'Dados necessários para autenticação do usuário',
    type: AuthDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: SignInResponseDto,
  })
  async signIn(@Body() authDto: AuthDto): Promise<SignInResponseDto> {
    const { email, password } = authDto;
    return await this.authService.signIn(email, password);
  }
}
