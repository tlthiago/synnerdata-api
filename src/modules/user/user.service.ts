import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const userExists = await this.userExists(email);

    if (userExists) {
      throw new ConflictException('Já existe um usuário com o mesmo e-mail.');
    }

    const passwordHash = await bcrypt.hash(password, 6);

    const userData = { ...createUserDto, password: passwordHash };
    const user = this.userRepository.create(userData);
    this.userRepository.save(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    return await this.userRepository.find({
      select: ['id', 'name', 'email', 'role'],
    });
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select: ['id', 'name', 'email', 'role'],
    });

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async userExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }
}
