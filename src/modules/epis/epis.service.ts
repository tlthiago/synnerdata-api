import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEpiDto } from './dto/create-epi.dto';
import { UpdateEpiDto } from './dto/update-epi.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Epi } from './entities/epi.entity';
import { Repository } from 'typeorm';
import { CompaniesService } from '../companies/companies.service';
import { plainToInstance } from 'class-transformer';
import { EpiResponseDto } from './dto/epi-response.dto';
import { BaseDeleteDto } from 'src/common/utils/dto/base-delete.dto';

@Injectable()
export class EpisService {
  constructor(
    @InjectRepository(Epi)
    private readonly epiRepository: Repository<Epi>,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(companyId: number, createEpiDto: CreateEpiDto) {
    const company = await this.companiesService.findOne(companyId);

    const epi = this.epiRepository.create({
      ...createEpiDto,
      empresa: company,
    });

    await this.epiRepository.save(epi);

    return epi.id;
  }

  async findAll(companyId: number) {
    await this.companiesService.findOne(companyId);

    const epis = await this.epiRepository.find({
      where: {
        empresa: { id: companyId },
        status: 'A',
      },
    });

    return plainToInstance(EpiResponseDto, epis);
  }

  async findOne(id: number) {
    const epi = await this.epiRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    return plainToInstance(EpiResponseDto, epi);
  }

  async update(id: number, updateEpiDto: UpdateEpiDto) {
    const result = await this.epiRepository.update(id, {
      ...updateEpiDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Epi não encontrado.');
    }

    return `O epi #${id} foi atualizado.`;
  }

  async remove(id: number, deleteEpiDto: BaseDeleteDto) {
    const result = await this.epiRepository.update(id, {
      status: 'E',
      atualizadoPor: deleteEpiDto.excluidoPor,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Epi não encontrado.');
    }

    return `O epi #${id} foi excluído.`;
  }
}
