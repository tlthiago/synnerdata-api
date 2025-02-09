import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Repository } from 'typeorm';
import { CompaniesService } from '../companies/companies.service';
import { UsersService } from '../users/users.service';
import { BranchResponseDto } from './dto/branch-response.dto';
import { plainToInstance } from 'class-transformer';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>,
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
  ) {}

  async create(companyId: number, createBranchDto: CreateBranchDto) {
    const user = await this.usersService.findOne(createBranchDto.criadoPor);

    await this.companiesService.findById(companyId);

    const companyWithSameCnpj = await this.companiesService.findByCnpj(
      createBranchDto.cnpj,
    );

    const branchExists = await this.findByCnpj(createBranchDto.cnpj);

    if (companyWithSameCnpj || branchExists) {
      throw new ConflictException(
        'Já existe uma organização com o mesmo CNPJ.',
      );
    }

    const company = await this.companiesService.findOne(companyId);

    const branch = this.branchesRepository.create({
      ...createBranchDto,
      dataFundacao: new Date(createBranchDto.dataFundacao),
      criadoPor: user,
      empresa: company,
    });
    await this.branchesRepository.save(branch);

    return branch.id;
  }

  async findAll(companyId: number) {
    const company = await this.companiesService.findOne(companyId);

    const branches = this.branchesRepository.find({
      where: {
        empresa: { id: company.id },
        status: 'A',
      },
    });

    return plainToInstance(BranchResponseDto, branches, {
      excludeExtraneousValues: true,
    });
  }

  findOne(id: number) {
    const branch = this.branchesRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!branch) {
      throw new NotFoundException('Filial não encontrada.');
    }

    return plainToInstance(BranchResponseDto, branch, {
      excludeExtraneousValues: true,
    });
  }

  async findByCnpj(cnpj: string): Promise<boolean> {
    const branch = await this.branchesRepository.findOne({
      where: {
        cnpj,
      },
    });

    return !!branch;
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    const user = await this.usersService.findOne(updateBranchDto.atualizadoPor);

    if (updateBranchDto.cnpj) {
      const companyExists = await this.companiesService.findByCnpj(
        updateBranchDto.cnpj,
      );
      const branchExists = await this.findByCnpj(updateBranchDto.cnpj);

      if (companyExists || branchExists) {
        throw new ConflictException(
          'Já existe uma organização com o mesmo CNPJ.',
        );
      }
    }

    const result = await this.branchesRepository.update(id, {
      ...updateBranchDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Filial não encontrada.');
    }

    return this.findOne(id);
  }

  async remove(id: number, deleteBranchDto: BaseDeleteDto) {
    const user = await this.usersService.findOne(deleteBranchDto.excluidoPor);

    const result = await this.branchesRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Filial não encontrada.');
    }

    return { id, status: 'E' };
  }
}
