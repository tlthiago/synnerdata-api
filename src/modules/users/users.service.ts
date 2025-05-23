import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Funcao, User } from './entities/user.entity';
import { UsersResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { CreateInitialUserDto } from './dto/create-initial-user.dto';
import { CompaniesService } from '../companies/companies.service';
import { Company } from '../companies/entities/company.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.email = createUserDto.email.trim().toLowerCase();

    const user = this.usersRepository.create({
      ...createUserDto,
      funcao: Funcao.SUPER_ADMIN,
    });

    await this.usersRepository.save(user);

    return plainToInstance(UsersResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async createInitialUser(
    createInitialUserDto: CreateInitialUserDto,
    manager?: EntityManager,
  ) {
    const userRepository = manager
      ? manager.getRepository(User)
      : this.usersRepository;

    const userExists = await userRepository.findOne({
      where: { email: createInitialUserDto.email.trim().toLowerCase() },
    });

    if (userExists) {
      throw new ConflictException('Já existe um usuário com o mesmo email.');
    }

    const companyRepository = await manager.getRepository(Company);

    const company = await companyRepository.findOne({
      where: { id: createInitialUserDto.empresaId },
    });

    createInitialUserDto.email = createInitialUserDto.email
      .trim()
      .toLowerCase();

    const user = userRepository.create({
      ...createInitialUserDto,
      status: 'P',
      funcao: Funcao.ADMIN,
      empresa: company.id,
    });

    return await userRepository.save(user);
  }

  async findAll() {
    const users = await this.usersRepository.find();

    return plainToInstance(UsersResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async findAllByCompany(id: string) {
    const company = await this.companiesService.findById(id);

    const users = await this.usersRepository.find({
      where: { empresa: company.id },
    });

    return plainToInstance(UsersResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
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

  async findById(id: string) {
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
      where: { email: email.trim().toLowerCase() },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, updatedBy: string) {
    const user = await this.usersRepository.findOne({
      where: { id: updatedBy },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const result = await this.usersRepository.update(id, {
      ...updateUserDto,
      atualizadoPor: user.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const updatedUser = await this.findOne(id);

    return updatedUser;
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersRepository.findOne({
      where: { id: deletedBy },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const result = await this.usersRepository.update(
      { id, status: 'A' },
      {
        status: 'E',
        atualizadoPor: user.id,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const removedUser = await this.usersRepository.findOne({
      where: { id },
    });

    return plainToInstance(UsersResponseDto, removedUser, {
      excludeExtraneousValues: true,
    });
  }

  async activateUser(
    id: string,
    nome: string,
    email: string,
    password: string,
  ) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const result = await this.usersRepository.update(id, {
      nome,
      email,
      senha: password,
      status: 'A',
    });

    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return `O usuário foi ativado.`;
  }

  async updateUsername(id: string, nome: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const result = await this.usersRepository.update(id, {
      nome,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return `O nome do usuário foi atualizado.`;
  }

  async updatePassword(id: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const result = await this.usersRepository.update(id, {
      senha: password,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return `A senha do usuário foi atualizada.`;
  }

  async markAsActive(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const result = await this.usersRepository.update(id, {
      status: 'A',
    });

    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return `O status do usuário foi atualizado.`;
  }
}
