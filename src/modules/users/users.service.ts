import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
    const result = await this.usersRepository.update(id, {
      ...updateUserDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado.');
    }
  }

  async remove(id: number) {
    const result = await this.usersRepository.update(id, {
      status: 'E',
    });

    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return `O usuário #${id} foi excluído.`;
  }
}
