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

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>,
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    companyId: string,
    createBranchDto: CreateBranchDto,
    createdBy: string,
  ) {
    const company = await this.companiesService.findOne(companyId);

    const user = await this.usersService.findOne(createdBy);

    const companyWithSameCnpj = await this.companiesService.findByCnpj(
      createBranchDto.cnpj,
    );

    const branchExists = await this.findByCnpj(createBranchDto.cnpj);

    if (companyWithSameCnpj || branchExists) {
      throw new ConflictException(
        'Já existe uma organização com o mesmo CNPJ.',
      );
    }

    const branch = this.branchesRepository.create({
      ...createBranchDto,
      dataFundacao: new Date(createBranchDto.dataFundacao),
      empresa: { id: company.id },
      criadoPor: user,
    });

    await this.branchesRepository.save(branch);

    return plainToInstance(BranchResponseDto, branch, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(companyId: string) {
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

  async findOne(id: string) {
    const branch = await this.branchesRepository.findOne({
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

  async update(
    id: string,
    updateBranchDto: UpdateBranchDto,
    updatedBy: string,
  ) {
    const user = await this.usersService.findOne(updatedBy);

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

    const updatedBranch = await this.findOne(id);

    return updatedBranch;
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.branchesRepository.update(
      { id, status: 'A' },
      {
        status: 'E',
        atualizadoPor: user,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Filial já excluída ou não encontrado.');
    }

    const removedBranch = await this.branchesRepository.findOne({
      where: { id },
    });

    return plainToInstance(BranchResponseDto, removedBranch, {
      excludeExtraneousValues: true,
    });
  }
}
