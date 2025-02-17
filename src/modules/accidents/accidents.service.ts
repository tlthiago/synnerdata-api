import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { UpdateAccidentDto } from './dto/update-accident.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Accident } from './entities/accident.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { AccidentResponseDto } from './dto/accidents-response.dto';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AccidentsService {
  constructor(
    @InjectRepository(Accident)
    private readonly accidentRepository: Repository<Accident>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
  ) {}

  async create(employeeId: number, createAccidentDto: CreateAccidentDto) {
    const employee = await this.employeesService.findOne(employeeId);

    const user = await this.usersService.findOne(createAccidentDto.criadoPor);

    const accident = this.accidentRepository.create({
      ...createAccidentDto,
      funcionario: employee,
      criadoPor: user,
    });

    await this.accidentRepository.save(accident);

    return accident.id;
  }

  async findAll(employeeId: number) {
    const employee = await this.employeesService.findOne(employeeId);

    const accidents = await this.accidentRepository.find({
      where: {
        funcionario: { id: employee.id },
        status: 'A',
      },
    });

    return plainToInstance(AccidentResponseDto, accidents, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number) {
    const accident = await this.accidentRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!accident) {
      throw new NotFoundException('Acidente não encontrado.');
    }

    return plainToInstance(AccidentResponseDto, accident, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, updateAccidentDto: UpdateAccidentDto) {
    const user = await this.usersService.findOne(
      updateAccidentDto.atualizadoPor,
    );

    const result = await this.accidentRepository.update(id, {
      ...updateAccidentDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Acidente não encontrado.');
    }

    return this.findOne(id);
  }

  async remove(id: number, deleteAccidentDto: BaseDeleteDto) {
    const user = await this.usersService.findOne(deleteAccidentDto.excluidoPor);

    const result = await this.accidentRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Acidente não encontrado.');
    }

    return { id, status: 'E' };
  }
}
