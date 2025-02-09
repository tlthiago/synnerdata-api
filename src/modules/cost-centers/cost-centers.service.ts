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
import { UsersService } from '../users/users.service';

@Injectable()
export class CostCentersService {
  constructor(
    @InjectRepository(CostCenter)
    private readonly costCenterRepository: Repository<CostCenter>,
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
  ) {}

  async create(companyId: number, createCostCenterDto: CreateCostCenterDto) {
    const company = await this.companiesService.findOne(companyId);

    const user = await this.usersService.findOne(createCostCenterDto.criadoPor);

    const costCenter = this.costCenterRepository.create({
      ...createCostCenterDto,
      empresa: company,
      criadoPor: user,
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
    const user = await this.usersService.findOne(
      updateCostCenterDto.atualizadoPor,
    );

    const result = await this.costCenterRepository.update(id, {
      ...updateCostCenterDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Setor não encontrado.');
    }

    return `O centro de custo #${id} foi atualizado.`;
  }

  async remove(id: number, deleteCostCenterDto: DeleteCostCenterDto) {
    const user = await this.usersService.findOne(
      deleteCostCenterDto.excluidoPor,
    );

    const result = await this.costCenterRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Setor não encontrado.');
    }

    return `O centro de custo #${id} foi excluído.`;
  }
}
