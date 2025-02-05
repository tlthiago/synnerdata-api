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

@Injectable()
export class AccidentsService {
  constructor(
    @InjectRepository(Accident)
    private readonly accidentRepository: Repository<Accident>,
    private readonly employeesService: EmployeesService,
  ) {}

  async create(employeeId: number, createAccidentDto: CreateAccidentDto) {
    const employee = await this.employeesService.findOne(employeeId);

    const accident = this.accidentRepository.create({
      ...createAccidentDto,
      funcionario: employee,
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
    const result = await this.accidentRepository.update(id, {
      ...updateAccidentDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Acidente não encontrado.');
    }

    return `O acidente #${id} foi atualizado.`;
  }

  async remove(id: number, deleteAccidentDto: BaseDeleteDto) {
    const result = await this.accidentRepository.update(id, {
      status: 'E',
      atualizadoPor: deleteAccidentDto.excluidoPor,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Acidente não encontrado.');
    }

    return `O acidente #${id} foi excluído.`;
  }
}
