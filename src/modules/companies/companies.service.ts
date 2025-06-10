import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { EntityManager, Repository } from 'typeorm';
import { CompanyResponseDto } from './dto/company-response.dto';
import { plainToInstance } from 'class-transformer';
import { CreateInitialCompanyDto } from './dto/create-initial-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    createCompanyDto.email = createCompanyDto.email.trim().toLowerCase();

    const companyExists = await this.findByCnpj(createCompanyDto.cnpj);

    if (companyExists) {
      throw new ConflictException('Já existe uma empresa com o mesmo CNPJ.');
    }

    const company = this.companiesRepository.create({
      ...createCompanyDto,
      dataFundacao: new Date(createCompanyDto.dataFundacao),
    });
    await this.companiesRepository.save(company);

    return plainToInstance(CompanyResponseDto, company, {
      excludeExtraneousValues: true,
    });
  }

  async createInitialCompany(
    createInitialCompanyDto: CreateInitialCompanyDto,
    manager?: EntityManager,
  ) {
    const repository = manager
      ? manager.getRepository(Company)
      : this.companiesRepository;

    const companyExists = await repository.findOne({
      where: { cnpj: createInitialCompanyDto.cnpj },
    });

    if (companyExists) {
      throw new ConflictException('Já existe uma empresa com o mesmo CNPJ.');
    }

    const emailAlreadyRegistered = await repository.findOne({
      where: { email: createInitialCompanyDto.email.trim().toLowerCase() },
    });

    if (emailAlreadyRegistered) {
      throw new ConflictException('Já existe uma empresa com o mesmo email.');
    }

    createInitialCompanyDto.email = createInitialCompanyDto.email
      .trim()
      .toLowerCase();

    const company = repository.create({
      ...createInitialCompanyDto,
      status: 'P',
    });

    return await repository.save(company);
  }

  async findAll() {
    const companies = await this.companiesRepository.find();

    return plainToInstance(CompanyResponseDto, companies, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const company = await this.companiesRepository.findOne({
      where: {
        id,
      },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    return plainToInstance(CompanyResponseDto, company, {
      excludeExtraneousValues: true,
    });
  }

  async findById(id: string) {
    const company = await this.companiesRepository.findOne({ where: { id } });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    return company;
  }

  async findByCnpj(cnpj: string) {
    const company = await this.companiesRepository.findOne({
      where: {
        cnpj,
      },
    });

    return company;
  }

  async findByEmail(email: string): Promise<boolean> {
    const company = await this.companiesRepository.findOne({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    return !!company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    if (updateCompanyDto.cnpj) {
      const companyExists = await this.findByCnpj(updateCompanyDto.cnpj);

      if (companyExists) {
        throw new ConflictException('Já existe uma empresa com o mesmo CNPJ.');
      }
    }

    const result = await this.companiesRepository.update(id, {
      ...updateCompanyDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    const updatedCompany = await this.findOne(id);

    return updatedCompany;
  }

  async remove(id: string) {
    const result = await this.companiesRepository.update(
      { id, status: 'A' },
      {
        status: 'E',
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    const removedCompany = await this.companiesRepository.findOne({
      where: { id },
    });

    return plainToInstance(CompanyResponseDto, removedCompany, {
      excludeExtraneousValues: true,
    });
  }

  async findPbUrl(id: string) {
    const company = await this.companiesRepository.findOne({
      where: {
        id,
      },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    if (company.pbUrl === null) {
      throw new NotFoundException('A empresa não possui URL do Power BI.');
    }

    return company.pbUrl;
  }
}
