import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCboDto } from './dto/create-cbo.dto';
import { UpdateCboDto } from './dto/update-cbo.dto';
import { Repository } from 'typeorm';
import { CompaniesService } from '../companies/companies.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Cbo } from './entities/cbo.entity';
import { CboResponseDto } from './dto/cbo-response.dto';
import { plainToInstance } from 'class-transformer';
import { UsersService } from '../users/users.service';

@Injectable()
export class CbosService {
  constructor(
    @InjectRepository(Cbo)
    private readonly cboRepository: Repository<Cbo>,
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    companyId: string,
    createCboDto: CreateCboDto,
    createdBy: string,
  ) {
    const company = await this.companiesService.findOne(companyId);

    const user = await this.usersService.findOne(createdBy);

    const cbo = this.cboRepository.create({
      ...createCboDto,
      empresa: { id: company.id },
      criadoPor: user,
    });

    await this.cboRepository.save(cbo);

    return plainToInstance(CboResponseDto, cbo, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(companyId: string) {
    const company = await this.companiesService.findOne(companyId);

    const cbos = await this.cboRepository.find({
      where: {
        empresa: { id: company.id },
        status: 'A',
      },
    });

    return plainToInstance(CboResponseDto, cbos, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const cbo = await this.cboRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!cbo) {
      throw new NotFoundException('Cbo não encontrado.');
    }

    return plainToInstance(CboResponseDto, cbo, {
      excludeExtraneousValues: true,
    });
  }

  async findOneInternal(id: string) {
    const cbo = await this.cboRepository.findOne({
      where: {
        id,
      },
    });

    if (!cbo) {
      throw new NotFoundException('Cbo não encontrado.');
    }

    return cbo;
  }

  async update(id: string, updateCboDto: UpdateCboDto, updatedBy: string) {
    const user = await this.usersService.findOne(updatedBy);

    const result = await this.cboRepository.update(id, {
      ...updateCboDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Cbo não encontrado.');
    }

    const updatedCbo = await this.findOne(id);

    return updatedCbo;
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.cboRepository.update(
      { id, status: 'A' },
      {
        status: 'E',
        atualizadoPor: user,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Cbo já excluído ou não encontrado.');
    }

    const removedCbo = await this.cboRepository.findOne({
      where: { id },
    });

    return plainToInstance(CboResponseDto, removedCbo, {
      excludeExtraneousValues: true,
    });
  }
}
