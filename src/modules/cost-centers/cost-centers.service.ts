import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CompaniesService } from '../companies/companies.service';
import { CostCenter } from './entities/cost-center.entity';
import { DeleteCostCenterDto } from './dto/delete-cost-center.dto';
import { plainToInstance } from 'class-transformer';
import { CostCenterResponseDto } from './dto/cost-center-response.dto';

@Injectable()
export class CostCentersService {
  constructor(
    @InjectRepository(CostCenter)
    private readonly costCenterRepository: Repository<CostCenter>,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(companyId: number, createCostCenterDto: CreateCostCenterDto) {
    const company = await this.companiesService.findOne(companyId);

    const costCenter = this.costCenterRepository.create({
      ...createCostCenterDto,
      empresa: company,
    });

    await this.costCenterRepository.save(costCenter);

    return costCenter.id;
  }

  async findAll(companyId: number) {
    await this.companiesService.findOne(companyId);

    const costCenters = await this.costCenterRepository.find({
      where: {
        empresa: { id: companyId },
        status: 'A',
      },
    });

    return plainToInstance(CostCenterResponseDto, costCenters);
  }

  async findOne(id: number) {
    const costCenter = await this.costCenterRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    return plainToInstance(CostCenterResponseDto, costCenter);
  }

  async update(id: number, updateCostCenterDto: UpdateCostCenterDto) {
    const result = await this.costCenterRepository.update(id, {
      ...updateCostCenterDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Setor não encontrado.');
    }

    return `O centro de custo #${id} foi atualizado.`;
  }

  async remove(id: number, deleteCostCenterDto: DeleteCostCenterDto) {
    const result = await this.costCenterRepository.update(id, {
      status: 'E',
      atualizadoPor: deleteCostCenterDto.excluidoPor,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Setor não encontrado.');
    }

    return `O centro de custo #${id} foi excluído.`;
  }
}
