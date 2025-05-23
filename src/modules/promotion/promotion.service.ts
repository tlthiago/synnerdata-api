import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    private readonly employeesService: EmployeesService,
    private readonly roleService: RolesService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    employeeId: string,
    createPromotionDto: CreatePromotionDto,
    createdBy: string,
  ) {
    const employee = await this.employeesService.findOne(employeeId);

    const role = await this.roleService.findById(createPromotionDto.funcaoId);

    const user = await this.usersService.findOne(createdBy);

    const promotion = this.promotionRepository.create({
      ...createPromotionDto,
      funcao: { id: role.id },
      funcionario: { id: employee.id },
      criadoPor: user,
    });

    await this.promotionRepository.save(promotion);

    return plainToInstance(PromotionResponseDto, promotion, {
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
    const role = await this.roleService.findById(updatePromotionDto.funcaoId);

    const user = await this.usersService.findOne(updatedBy);

    const result = await this.promotionRepository.update(id, {
      ...updatePromotionDto,
      funcao: role,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Promoção não encontrada.');
    }

    const updatedPromotion = await this.findOne(id);

    return updatedPromotion;
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
    });

    return plainToInstance(PromotionResponseDto, removedPromotion, {
      excludeExtraneousValues: true,
    });
  }
}
