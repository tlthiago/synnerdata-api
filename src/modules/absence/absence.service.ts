import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Absence } from './entities/absence.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { AbsenceResponseDto } from './dto/absence-response.dto';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class AbsenceService {
  constructor(
    @InjectRepository(Absence)
    private readonly absenceRepository: Repository<Absence>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(
    employeeId: string,
    createAbsenceDto: CreateAbsenceDto,
    createdBy: string,
  ) {
    const employee = await this.employeesService.findOne(employeeId);

    const user = await this.usersService.findOne(createdBy);

    const absenceDate = new Date(createAbsenceDto.data);
    absenceDate.setHours(0, 0, 0, 0);

    const existingAbsence = await this.absenceRepository.findOne({
      where: {
        funcionario: { id: employeeId },
        data: absenceDate,
      },
    });

    if (existingAbsence) {
      throw new ConflictException(
        'O funcionário já possui uma falta registrada para este dia.',
      );
    }

    const absence = this.absenceRepository.create({
      ...createAbsenceDto,
      funcionario: { id: employee.id },
      criadoPor: user,
    });

    await this.absenceRepository.save(absence);

    return await this.findOne(absence.id);
  }

  async findAllByCompany(companyId: string) {
    const company = await this.companiesService.findById(companyId);

    const absences = await this.absenceRepository
      .createQueryBuilder('falta')
      .innerJoinAndSelect('falta.funcionario', 'funcionario')
      .innerJoinAndSelect('falta.criadoPor', 'criadoPor')
      .leftJoinAndSelect('falta.atualizadoPor', 'atualizadoPor')
      .innerJoin('funcionario.empresa', 'empresa')
      .where('empresa.id = :companyId', { companyId: company.id })
      .andWhere('falta.status = :status', { status: 'A' })
      .getMany();

    return plainToInstance(AbsenceResponseDto, absences, {
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
      relations: ['funcionario'],
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
      relations: ['funcionario'],
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

    if (updateAbsenceDto.data) {
      const absenceDate = new Date(updateAbsenceDto.data);
      absenceDate.setHours(0, 0, 0, 0);

      const currentAbsence = await this.absenceRepository.findOne({
        where: { id },
        relations: ['funcionario'],
      });

      if (!currentAbsence) {
        throw new NotFoundException('Falta não encontrada.');
      }

      const existingAbsence = await this.absenceRepository.findOne({
        where: {
          funcionario: { id: currentAbsence.funcionario.id },
          data: absenceDate,
        },
      });

      if (existingAbsence && existingAbsence.id !== id) {
        throw new ConflictException(
          'O funcionário já possui uma falta registrada para este dia.',
        );
      }
    }

    const result = await this.absenceRepository.update(id, {
      ...updateAbsenceDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Falta não encontrada.');
    }

    return await this.findOne(id);
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
      relations: ['funcionario'],
    });

    return plainToInstance(AbsenceResponseDto, removedAbsence, {
      excludeExtraneousValues: true,
    });
  }
}
