import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CompaniesService } from '../companies/companies.service';
import { CostCenter } from './entities/cost-center.entity';
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

  async create(
    companyId: string,
    createCostCenterDto: CreateCostCenterDto,
    createdBy: string,
  ) {
    const company = await this.companiesService.findOne(companyId);

    const user = await this.usersService.findOne(createdBy);

    const costCenter = this.costCenterRepository.create({
      ...createCostCenterDto,
      empresa: { id: company.id },
      criadoPor: user,
    });

    await this.costCenterRepository.save(costCenter);

    return plainToInstance(CostCenterResponseDto, costCenter, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(companyId: string) {
    const company = await this.companiesService.findOne(companyId);

    const costCenters = await this.costCenterRepository.find({
      where: {
        empresa: { id: company.id },
        status: 'A',
      },
    });

    return plainToInstance(CostCenterResponseDto, costCenters, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const costCenter = await this.costCenterRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!costCenter) {
      throw new NotFoundException('Centro de custo não encontrado.');
    }

    return plainToInstance(CostCenterResponseDto, costCenter, {
      excludeExtraneousValues: true,
    });
  }

  async findOneInternal(id: string) {
    const costCenter = await this.costCenterRepository.findOne({
      where: {
        id,
      },
    });

    if (!costCenter) {
      throw new NotFoundException('Centro de custo não encontrado.');
    }

    return costCenter;
  }

  async update(
    id: string,
    updateCostCenterDto: UpdateCostCenterDto,
    updatedBy: string,
  ) {
    const user = await this.usersService.findOne(updatedBy);

    const result = await this.costCenterRepository.update(id, {
      ...updateCostCenterDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Centro de custo não encontrado.');
    }

    const updatedCostCenter = await this.findOne(id);

    return updatedCostCenter;
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.costCenterRepository.update(
      { id, status: 'A' },
      {
        status: 'E',
        atualizadoPor: user,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException(
        'Centro de custo já excluído ou não encontrado.',
      );
    }

    const removedCostCenter = await this.costCenterRepository.findOne({
      where: { id },
    });

    return plainToInstance(CostCenterResponseDto, removedCostCenter, {
      excludeExtraneousValues: true,
    });
  }
}
