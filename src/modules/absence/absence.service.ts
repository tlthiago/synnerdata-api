import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Absence } from './entities/absence.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { AbsenceResponseDto } from './dto/absence-response.dto';
import { BaseDeleteDto } from 'src/common/utils/dto/base-delete.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AbsenceService {
  constructor(
    @InjectRepository(Absence)
    private readonly absenceRepository: Repository<Absence>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
  ) {}

  async create(employeeId: number, createAbsenceDto: CreateAbsenceDto) {
    const employee = await this.employeesService.findOne(employeeId);

    const user = await this.usersService.findOne(createAbsenceDto.criadoPor);

    const absence = this.absenceRepository.create({
      ...createAbsenceDto,
      funcionario: employee,
      criadoPor: user,
    });

    await this.absenceRepository.save(absence);

    return absence.id;
  }

  async findAll(employeeId: number) {
    const employee = await this.employeesService.findOne(employeeId);

    const absences = await this.absenceRepository.find({
      where: {
        funcionario: { id: employee.id },
        status: 'A',
      },
    });

    return plainToInstance(AbsenceResponseDto, absences, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number) {
    const absence = await this.absenceRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!absence) {
      throw new NotFoundException('Falta não encontrada.');
    }

    return plainToInstance(AbsenceResponseDto, absence, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, updateAbsenceDto: UpdateAbsenceDto) {
    const user = await this.usersService.findOne(
      updateAbsenceDto.atualizadoPor,
    );

    const result = await this.absenceRepository.update(id, {
      ...updateAbsenceDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Falta não encontrada.');
    }

    return this.findOne(id);
  }

  async remove(id: number, deleteAbsenceDto: BaseDeleteDto) {
    const user = await this.usersService.findOne(deleteAbsenceDto.excluidoPor);

    const result = await this.absenceRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Falta não encontrada.');
    }

    return { id, status: 'E' };
  }
}
