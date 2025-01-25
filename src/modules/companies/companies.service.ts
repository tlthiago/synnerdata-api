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

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const companyExists = await this.findCompanyByCnpj(createCompanyDto.cnpj);

    if (companyExists) {
      throw new ConflictException('Já existe uma empresa com o mesmo CNPJ.');
    }

    const company = this.companiesRepository.create({
      ...createCompanyDto,
      dataFundacao: new Date(createCompanyDto.dataFundacao),
    });
    await this.companiesRepository.save(company);
  }

  findAll() {
    return this.companiesRepository.find();
  }

  async findOne(id: number) {
    const company = await this.companiesRepository.findOne({
      where: {
        id,
      },
    });

    if (!company) throw new NotFoundException('Empresa não encontrada.');

    return company;
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
    const company = await this.companiesRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    const result = await this.companiesRepository.update(id, {
      ...updateCompanyDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Empresa não encontrada.');
    }
  }

  async remove(id: number) {
    const result = await this.companiesRepository.update(id, {
      status: 'E',
    });

    if (result.affected === 0) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    return `A empresa #${id} foi excluída.`;
  }
}
