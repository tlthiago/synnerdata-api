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

@Injectable()
export class AbsenceService {
  constructor(
    @InjectRepository(Absence)
    private readonly absenceRepository: Repository<Absence>,
    private readonly employeesService: EmployeesService,
  ) {}

  async create(employeeId: number, createAbsenceDto: CreateAbsenceDto) {
    const employee = await this.employeesService.findOne(employeeId);

    const absence = this.absenceRepository.create({
      ...createAbsenceDto,
      funcionario: employee,
    });

    await this.absenceRepository.save(absence);

    return absence.id;
  }

  async findAll(employeeId: number) {
    await this.employeesService.findOne(employeeId);

    const absences = await this.absenceRepository.find({
      where: {
        funcionario: { id: employeeId },
        status: 'A',
      },
    });

    return plainToInstance(AbsenceResponseDto, absences);
  }

  async findOne(id: number) {
    const absence = await this.absenceRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    return plainToInstance(AbsenceResponseDto, absence);
  }

  async update(id: number, updateAbsenceDto: UpdateAbsenceDto) {
    const result = await this.absenceRepository.update(id, {
      ...updateAbsenceDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Falta não encontrada.');
    }

    return `A falta #${id} foi atualizada.`;
  }

  async remove(id: number, deleteAbsenceDto: BaseDeleteDto) {
    const result = await this.absenceRepository.update(id, {
      status: 'E',
      atualizadoPor: deleteAbsenceDto.excluidoPor,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Falta não encontrada.');
    }

    return `A falta #${id} foi excluída.`;
  }
}
