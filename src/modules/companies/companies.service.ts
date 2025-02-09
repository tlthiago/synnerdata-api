import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CompanyResponseDto } from './dto/company-response.dto';
import { plainToInstance } from 'class-transformer';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    private readonly usersService: UsersService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const user = await this.usersService.findOne(createCompanyDto.criadoPor);

    const companyExists = await this.findCompanyByCnpj(createCompanyDto.cnpj);

    if (companyExists) {
      throw new ConflictException('Já existe uma empresa com o mesmo CNPJ.');
    }

    const company = this.companiesRepository.create({
      ...createCompanyDto,
      dataFundacao: new Date(createCompanyDto.dataFundacao),
      criadoPor: user,
    });
    await this.companiesRepository.save(company);

    return company.id;
  }

  findAll() {
    const companies = this.companiesRepository.find();

    return plainToInstance(CompanyResponseDto, companies, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number) {
    const company = await this.companiesRepository.findOne({
      where: {
        id,
      },
    });

    if (!company) throw new NotFoundException('Empresa não encontrada.');

    return plainToInstance(CompanyResponseDto, company, {
      excludeExtraneousValues: true,
    });
  }

  async findCompanyByCnpj(cnpj: string): Promise<boolean> {
    const company = await this.companiesRepository.findOne({
      where: {
        cnpj,
      },
    });

    return !!company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const user = await this.usersService.findOne(
      updateCompanyDto.atualizadoPor,
    );

    if (updateCompanyDto.cnpj) {
      const companyExists = await this.findCompanyByCnpj(updateCompanyDto.cnpj);

      if (companyExists) {
        throw new ConflictException('Já existe uma empresa com o mesmo CNPJ.');
      }
    }

    const result = await this.companiesRepository.update(id, {
      ...updateCompanyDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    return this.findOne(id);
  }

  async remove(id: number, deleteCompanyDto: BaseDeleteDto) {
    const user = await this.usersService.findOne(deleteCompanyDto.excluidoPor);

    const result = await this.companiesRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    return { id, status: 'E' };
  }
}
