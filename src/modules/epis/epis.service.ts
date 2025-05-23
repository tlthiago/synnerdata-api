import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEpiDto } from './dto/create-epi.dto';
import { UpdateEpiDto } from './dto/update-epi.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Epi } from './entities/epi.entity';
import { In, Repository } from 'typeorm';
import { CompaniesService } from '../companies/companies.service';
import { plainToInstance } from 'class-transformer';
import { EpiResponseDto } from './dto/epi-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class EpisService {
  constructor(
    @InjectRepository(Epi)
    private readonly epiRepository: Repository<Epi>,
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    companyId: string,
    createEpiDto: CreateEpiDto,
    createdBy: string,
  ) {
    const company = await this.companiesService.findOne(companyId);

    const user = await this.usersService.findOne(createdBy);

    const epi = this.epiRepository.create({
      ...createEpiDto,
      empresa: { id: company.id },
      criadoPor: user,
    });

    await this.epiRepository.save(epi);

    return plainToInstance(EpiResponseDto, epi, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(companyId: string) {
    const company = await this.companiesService.findOne(companyId);

    const epis = await this.epiRepository.find({
      where: {
        empresa: { id: company.id },
        status: 'A',
      },
    });

    return plainToInstance(EpiResponseDto, epis, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const epi = await this.epiRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!epi) {
      throw new NotFoundException('Epi não encontrado.');
    }

    return plainToInstance(EpiResponseDto, epi, {
      excludeExtraneousValues: true,
    });
  }

  async findByIds(ids: string[]) {
    const epis = await this.epiRepository.findBy({
      id: In(ids),
    });

    if (epis.length === 0) {
      throw new NotFoundException('Epi(s) não encontrado(s).');
    }

    return epis;
  }

  async update(id: string, updateEpiDto: UpdateEpiDto, updatedBy: string) {
    const user = await this.usersService.findOne(updatedBy);

    const result = await this.epiRepository.update(id, {
      ...updateEpiDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Epi não encontrado.');
    }

    const updatedEpi = await this.findOne(id);

    return updatedEpi;
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.epiRepository.update(
      { id, status: 'A' },
      {
        status: 'E',
        atualizadoPor: user,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Epi não encontrado.');
    }

    const removedEpi = await this.epiRepository.findOne({
      where: { id },
    });

    return plainToInstance(EpiResponseDto, removedEpi, {
      excludeExtraneousValues: true,
    });
  }
}
