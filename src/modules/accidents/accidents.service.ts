import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { UpdateAccidentDto } from './dto/update-accident.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Accident } from './entities/accident.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { AccidentResponseDto } from './dto/accidents-response.dto';
import { BaseDeleteDto } from 'src/common/utils/dto/base-delete.dto';
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
    await this.employeesService.findOne(employeeId);

    const accidents = await this.accidentRepository.find({
      where: {
        funcionario: { id: employeeId },
        status: 'A',
      },
    });

    return plainToInstance(AccidentResponseDto, accidents);
  }

  async findOne(id: number) {
    const accident = await this.accidentRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    return plainToInstance(AccidentResponseDto, accident);
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

    return `O acidente #${id} foi atualizado.`;
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

    return `O acidente #${id} foi excluído.`;
  }
}
