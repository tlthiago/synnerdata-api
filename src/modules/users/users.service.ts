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
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let createdBy = null;

    if (createUserDto.criadoPor) {
      createdBy = await this.findOne(createUserDto.criadoPor);
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      criadoPor: createdBy,
    });
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<UsersResponseDto[]> {
    const users = await this.usersRepository.find();

    return plainToInstance(UsersResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number): Promise<UsersResponseDto> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return plainToInstance(UsersResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
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
    const updatedBy = await this.usersRepository.findOne({
      where: { id: updateUserDto.atualizadoPor },
    });

    if (!updatedBy) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const result = await this.usersRepository.update(id, {
      ...updateUserDto,
      atualizadoPor: updatedBy.id,
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
