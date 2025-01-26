import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCboDto } from './dto/create-cbo.dto';
import { UpdateCboDto } from './dto/update-cbo.dto';
import { Repository } from 'typeorm';
import { CompaniesService } from '../companies/companies.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Cbo } from './entities/cbo.entity';
import { CboResponseDto } from './dto/cbo-response.dto';
import { plainToInstance } from 'class-transformer';
import { BaseDeleteDto } from 'src/common/utils/dto/base-delete.dto';

@Injectable()
export class CbosService {
  constructor(
    @InjectRepository(Cbo)
    private readonly cboRepository: Repository<Cbo>,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(companyId: number, createCboDto: CreateCboDto) {
    const company = await this.companiesService.findOne(companyId);

    const costCenter = this.cboRepository.create({
      ...createCboDto,
      empresa: company,
    });

    await this.cboRepository.save(costCenter);

    return costCenter.id;
  }

  async findAll(companyId: number) {
    await this.companiesService.findOne(companyId);

    const cbos = await this.cboRepository.find({
      where: {
        empresa: { id: companyId },
        status: 'A',
      },
    });

    return plainToInstance(CboResponseDto, cbos);
  }

  async findOne(id: number) {
    const costCenter = await this.cboRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    return plainToInstance(CboResponseDto, costCenter);
  }

  async update(id: number, updateCboDto: UpdateCboDto) {
    const result = await this.cboRepository.update(id, {
      ...updateCboDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Cbo não encontrado.');
    }

    return `O cbo #${id} foi atualizado.`;
  }

  async remove(id: number, deleteCboDto: BaseDeleteDto) {
    const result = await this.cboRepository.update(id, {
      status: 'E',
      atualizadoPor: deleteCboDto.excluidoPor,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Cbo não encontrado.');
    }

    return `O cbo #${id} foi excluído.`;
  }
}
