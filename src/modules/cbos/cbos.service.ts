import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCboDto } from './dto/create-cbo.dto';
import { UpdateCboDto } from './dto/update-cbo.dto';
import { Repository } from 'typeorm';
import { CompaniesService } from '../companies/companies.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Cbo } from './entities/cbo.entity';
import { CboResponseDto } from './dto/cbo-response.dto';
import { plainToInstance } from 'class-transformer';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CbosService {
  constructor(
    @InjectRepository(Cbo)
    private readonly cboRepository: Repository<Cbo>,
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
  ) {}

  async create(companyId: number, createCboDto: CreateCboDto) {
    const company = await this.companiesService.findOne(companyId);

    const user = await this.usersService.findOne(createCboDto.criadoPor);

    const cbo = this.cboRepository.create({
      ...createCboDto,
      empresa: company,
      criadoPor: user,
    });

    await this.cboRepository.save(cbo);

    return cbo.id;
  }

  async findAll(companyId: number) {
    await this.companiesService.findOne(companyId);

    const cbos = await this.cboRepository.find({
      where: {
        empresa: { id: companyId },
        status: 'A',
      },
    });

    return plainToInstance(CboResponseDto, cbos, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number) {
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

  async update(id: number, updateCboDto: UpdateCboDto) {
    const user = await this.usersService.findOne(updateCboDto.atualizadoPor);

    const result = await this.cboRepository.update(id, {
      ...updateCboDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Cbo não encontrado.');
    }

    return this.findOne(id);
  }

  async remove(id: number, deleteCboDto: BaseDeleteDto) {
    const user = await this.usersService.findOne(deleteCboDto.excluidoPor);

    const result = await this.cboRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Cbo não encontrado.');
    }

    return `O cbo #${id} foi excluído.`;
  }
}
