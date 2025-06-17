import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { PromotionResponseDto } from './dto/promotion-response.dto';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    private readonly employeesService: EmployeesService,
    private readonly roleService: RolesService,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(
    employeeId: string,
    createPromotionDto: CreatePromotionDto,
    createdBy: string,
  ) {
    const employee = await this.employeesService.findOne(employeeId);

    const role = await this.roleService.findById(createPromotionDto.funcaoId);

    if (employee.funcao.id === role.id) {
      throw new ConflictException('O funcionário já possui essa função.');
    }

    const user = await this.usersService.findOne(createdBy);

    const promotion = this.promotionRepository.create({
      ...createPromotionDto,
      funcao: { id: role.id },
      funcionario: { id: employee.id },
      criadoPor: user,
    });

    await this.promotionRepository.save(promotion);

    await this.employeesService.updateEmployeeRole(employee.id, role, user);

    return await this.findOne(promotion.id);
  }

  async findAllByCompany(companyId: string) {
    const company = await this.companiesService.findById(companyId);

    const promotions = await this.promotionRepository
      .createQueryBuilder('promocao')
      .innerJoinAndSelect('promocao.funcionario', 'funcionario')
      .innerJoinAndSelect('promocao.funcao', 'funcao')
      .innerJoinAndSelect('promocao.criadoPor', 'criadoPor')
      .leftJoinAndSelect('promocao.atualizadoPor', 'atualizadoPor')
      .innerJoin('funcionario.empresa', 'empresa')
      .where('empresa.id = :companyId', { companyId: company.id })
      .andWhere('promocao.status = :status', { status: 'A' })
      .getMany();

    return plainToInstance(PromotionResponseDto, promotions, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(employeeId: string) {
    const employee = await this.employeesService.findOne(employeeId);

    const promotions = await this.promotionRepository.find({
      where: {
        funcionario: { id: employee.id },
        status: 'A',
      },
      relations: ['funcionario', 'funcao'],
    });

    return plainToInstance(PromotionResponseDto, promotions, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const promotion = await this.promotionRepository.findOne({
      where: {
        id,
        status: 'A',
      },
      relations: ['funcionario', 'funcao'],
    });

    if (!promotion) {
      throw new NotFoundException('Promoção não encontrada.');
    }

    return plainToInstance(PromotionResponseDto, promotion, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updatePromotionDto: UpdatePromotionDto,
    updatedBy: string,
  ) {
    const { funcaoId, ...rest } = updatePromotionDto;

    const role = await this.roleService.findById(funcaoId);

    const user = await this.usersService.findOne(updatedBy);

    const result = await this.promotionRepository.update(id, {
      ...rest,
      funcao: role,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Promoção não encontrada.');
    }

    const { funcionario } = await this.findOne(id);

    await this.employeesService.updateEmployeeRole(funcionario.id, role, user);

    return await this.findOne(id);
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.promotionRepository.update(
      { id, status: 'A' },
      {
        status: 'E',
        atualizadoPor: user,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Promoção já excluída ou não encontrada.');
    }

    const removedPromotion = await this.promotionRepository.findOne({
      where: { id },
      relations: ['funcionario', 'funcao'],
    });

    return plainToInstance(PromotionResponseDto, removedPromotion, {
      excludeExtraneousValues: true,
    });
  }
}
