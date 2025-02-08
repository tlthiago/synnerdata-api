import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<UsersResponseDto[]> {
    return await this.usersRepository.find({
      select: ['id', 'nome', 'email', 'funcao'],
    });
  }

  async findOne(id: number): Promise<UsersResponseDto> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
      select: ['id', 'nome', 'email', 'funcao'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (!updateUserDto.atualizadoPor) {
      throw new BadRequestException(
        'O usuário responsável pela atualização deve ser informado.',
      );
    }

    const user = await this.usersRepository.findOne({
      where: { id: updateUserDto.atualizadoPor },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const result = await this.usersRepository.update(id, {
      ...updateUserDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado.');
    }
  }

  async remove(id: number, deleteUserDto: BaseDeleteDto) {
    if (!deleteUserDto.excluidoPor) {
      throw new BadRequestException(
        'O usuário responsável pela exclusão deve ser informado.',
      );
    }

    const user = await this.usersRepository.findOne({
      where: { id: deleteUserDto.excluidoPor },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const result = await this.usersRepository.update(id, {
      status: 'E',
      atualizadoPor: deleteUserDto.excluidoPor,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return `O usuário #${id} foi excluído.`;
  }
}
