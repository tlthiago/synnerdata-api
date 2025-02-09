import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { plainToInstance } from 'class-transformer';
import { PromotionResponseDto } from './dto/promotion-response.dto';
import { BaseDeleteDto } from 'src/common/utils/dto/base-delete.dto';
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

  async create(employeeId: number, createPromotionDto: CreatePromotionDto) {
    const employee = await this.employeesService.findOne(employeeId);

    const role = await this.roleService.findRoleById(
      createPromotionDto.funcaoId,
    );

    const user = await this.usersService.findOne(createPromotionDto.criadoPor);

    const promotion = this.promotionRepository.create({
      ...createPromotionDto,
      funcao: role,
      funcionario: employee,
      criadoPor: user,
    });

    await this.promotionRepository.save(promotion);

    return promotion.id;
  }

  async findAll(employeeId: number) {
    await this.employeesService.findOne(employeeId);

    const promotions = await this.promotionRepository.find({
      where: {
        funcionario: { id: employeeId },
        status: 'A',
      },
    });

    return plainToInstance(PromotionResponseDto, promotions);
  }

  async findOne(id: number) {
    const promotion = await this.promotionRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    return plainToInstance(PromotionResponseDto, promotion);
  }

  async update(id: number, updatePromotionDto: UpdatePromotionDto) {
    const role = await this.roleService.findRoleById(
      updatePromotionDto.funcaoId,
    );

    const user = await this.usersService.findOne(
      updatePromotionDto.atualizadoPor,
    );

    const result = await this.promotionRepository.update(id, {
      ...updatePromotionDto,
      funcao: role,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Promoção não encontrada.');
    }

    return `A promoção #${id} foi atualizada.`;
  }

  async remove(id: number, deletePromotionDto: BaseDeleteDto) {
    const user = await this.usersService.findOne(
      deletePromotionDto.excluidoPor,
    );

    const result = await this.promotionRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Promoção não encontrada.');
    }

    return `A promoção #${id} foi excluída.`;
  }
}
