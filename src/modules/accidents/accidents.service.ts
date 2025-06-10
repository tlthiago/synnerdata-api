import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { UpdateAccidentDto } from './dto/update-accident.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Accident } from './entities/accident.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { AccidentResponseDto } from './dto/accidents-response.dto';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class AccidentsService {
  constructor(
    @InjectRepository(Accident)
    private readonly accidentRepository: Repository<Accident>,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(
    employeeId: string,
    createAccidentDto: CreateAccidentDto,
    createdBy: string,
  ) {
    const employee = await this.employeesService.findOne(employeeId);

    const user = await this.usersService.findOne(createdBy);

    const accident = this.accidentRepository.create({
      ...createAccidentDto,
      funcionario: { id: employee.id },
      criadoPor: user,
    });

    await this.accidentRepository.save(accident);

    return await this.findOne(accident.id);
  }

  async findAllByCompany(companyId: string) {
    const company = await this.companiesService.findById(companyId);

    const accidents = await this.accidentRepository
      .createQueryBuilder('acidente')
      .innerJoinAndSelect('acidente.funcionario', 'funcionario')
      .innerJoin('funcionario.empresa', 'empresa')
      .where('empresa.id = :companyId', { companyId: company.id })
      .andWhere('acidente.status = :status', { status: 'A' })
      .getMany();

    return plainToInstance(AccidentResponseDto, accidents, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(employeeId: string) {
    const employee = await this.employeesService.findOne(employeeId);

    const accidents = await this.accidentRepository.find({
      where: {
        funcionario: { id: employee.id },
        status: 'A',
      },
      relations: ['funcionario'],
    });

    return plainToInstance(AccidentResponseDto, accidents, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const accident = await this.accidentRepository.findOne({
      where: {
        id,
        status: 'A',
      },
      relations: ['funcionario'],
    });

    if (!accident) {
      throw new NotFoundException('Acidente não encontrado.');
    }

    return plainToInstance(AccidentResponseDto, accident, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateAccidentDto: UpdateAccidentDto,
    updatedBy: string,
  ) {
    const user = await this.usersService.findOne(updatedBy);

    const result = await this.accidentRepository.update(id, {
      ...updateAccidentDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Acidente não encontrado.');
    }

    return await this.findOne(id);
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.accidentRepository.update(
      { id, status: 'A' },
      {
        status: 'E',
        atualizadoPor: user,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Acidente já excluído ou não encontrado.');
    }

    const removedAccident = await this.accidentRepository.findOne({
      where: { id },
      relations: ['funcionario'],
    });

    return plainToInstance(AccidentResponseDto, removedAccident, {
      excludeExtraneousValues: true,
    });
  }
}
