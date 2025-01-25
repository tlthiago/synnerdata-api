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

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(empresaId: number, createBranchDto: CreateBranchDto) {
    const companyExists = await this.companiesService.findCompanyByCnpj(
      createBranchDto.cnpj,
    );
    const branchExists = await this.findBranchByCnpj(createBranchDto.cnpj);

    if (companyExists || branchExists) {
      throw new ConflictException('Já existe uma empresa com o mesmo CNPJ.');
    }

    const company = await this.companiesService.findOne(empresaId);

    const branch = this.branchesRepository.create({
      ...createBranchDto,
      dataFundacao: new Date(createBranchDto.dataFundacao),
      empresa: company,
    });
    await this.branchesRepository.save(branch);

    return branch.id;
  }

  async findAll(empresaId: number) {
    await this.companiesService.findOne(empresaId);

    return this.branchesRepository.find({
      where: {
        empresa: { id: empresaId },
        status: 'A',
      },
    });
  }

  async findOne(id: number) {
    return this.branchesRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });
  }

  async findBranchByCnpj(cnpj: string): Promise<boolean> {
    const branch = await this.branchesRepository.findOne({
      where: {
        cnpj,
      },
    });

    return !!branch;
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    const companyExists = await this.companiesService.findCompanyByCnpj(
      updateBranchDto.cnpj,
    );
    const branchExists = await this.findBranchByCnpj(updateBranchDto.cnpj);

    if (companyExists || branchExists) {
      throw new ConflictException('Já existe uma empresa com o mesmo CNPJ.');
    }

    const result = await this.branchesRepository.update(id, {
      ...updateBranchDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Filial não encontrada.');
    }

    return `A filial #${id} foi atualizada.`;
  }

  async remove(id: number) {
    const result = await this.branchesRepository.update(id, {
      status: 'E',
    });

    if (result.affected === 0) {
      throw new NotFoundException('Filial não encontrada.');
    }

    return `A filial #${id} foi excluída.`;
  }
}
