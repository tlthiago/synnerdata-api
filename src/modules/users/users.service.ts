import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { UsersResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
  }

  async findAll(): Promise<UsersResponseDto[]> {
    return await this.userRepository.find({
      select: ['id', 'name', 'email', 'role'],
    });
  }

  async findOne(id: number): Promise<UsersResponseDto> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select: ['id', 'name', 'email', 'role'],
    });

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userId = +id;

    if (isNaN(userId)) {
      throw new BadRequestException('ID de usuário inválido.');
    }

    const result = await this.userRepository.update(userId, updateUserDto);

    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado.');
    }
  }
}
