import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Absence } from './entities/absence.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { AbsenceResponseDto } from './dto/absence-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AbsenceService {
  constructor(
    @InjectRepository(Absence)
    private readonly absenceRepository: Repository<Absence>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    employeeId: string,
    createAbsenceDto: CreateAbsenceDto,
    createdBy: string,
  ) {
    const employee = await this.employeesService.findOne(employeeId);

    const user = await this.usersService.findOne(createdBy);

    const absence = this.absenceRepository.create({
      ...createAbsenceDto,
      funcionario: { id: employee.id },
      criadoPor: user,
    });

    await this.absenceRepository.save(absence);

    return plainToInstance(AbsenceResponseDto, absence, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(employeeId: string) {
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

  async findOne(id: string) {
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

  async update(
    id: string,
    updateAbsenceDto: UpdateAbsenceDto,
    updatedBy: string,
  ) {
    const user = await this.usersService.findOne(updatedBy);

    const result = await this.absenceRepository.update(id, {
      ...updateAbsenceDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Falta não encontrada.');
    }

    const updatedAbsence = await this.findOne(id);

    return updatedAbsence;
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.absenceRepository.update(
      { id, status: 'A' },
      {
        status: 'E',
        atualizadoPor: user,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Falta já excluída ou não encontrada.');
    }

    const removedAbsence = await this.absenceRepository.findOne({
      where: { id },
    });

    return plainToInstance(AbsenceResponseDto, removedAbsence, {
      excludeExtraneousValues: true,
    });
  }
}
