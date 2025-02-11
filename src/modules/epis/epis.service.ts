import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEpiDto } from './dto/create-epi.dto';
import { UpdateEpiDto } from './dto/update-epi.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Epi } from './entities/epi.entity';
import { In, Repository } from 'typeorm';
import { CompaniesService } from '../companies/companies.service';
import { plainToInstance } from 'class-transformer';
import { EpiResponseDto } from './dto/epi-response.dto';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class EpisService {
  constructor(
    @InjectRepository(Epi)
    private readonly epiRepository: Repository<Epi>,
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
  ) {}

  async create(companyId: number, createEpiDto: CreateEpiDto) {
    const company = await this.companiesService.findOne(companyId);

    const user = await this.usersService.findOne(createEpiDto.criadoPor);

    const epi = this.epiRepository.create({
      ...createEpiDto,
      empresa: company,
      criadoPor: user,
    });

    await this.epiRepository.save(epi);

    return epi.id;
  }

  async findAll(companyId: number) {
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

  async findOne(id: number) {
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

  async findByIds(ids: number[]) {
    const epis = await this.epiRepository.findBy({
      id: In(ids),
    });

    if (epis.length === 0) {
      throw new NotFoundException('Epi(s) não encontrado(s).');
    }

    return epis;
  }

  async update(id: number, updateEpiDto: UpdateEpiDto) {
    const user = await this.usersService.findOne(updateEpiDto.atualizadoPor);

    const result = await this.epiRepository.update(id, {
      ...updateEpiDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Epi não encontrado.');
    }

    return this.findOne(id);
  }

  async remove(id: number, deleteEpiDto: BaseDeleteDto) {
    const user = await this.usersService.findOne(deleteEpiDto.excluidoPor);

    const result = await this.epiRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Epi não encontrado.');
    }

    return { id, status: 'E' };
  }
}
