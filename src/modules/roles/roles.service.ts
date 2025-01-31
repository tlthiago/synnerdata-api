import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CompaniesService } from '../companies/companies.service';
import { plainToInstance } from 'class-transformer';
import { RoleResponseDto } from './dto/role-response.dto';
import { BaseDeleteDto } from 'src/common/utils/dto/base-delete.dto';
import { EpisService } from '../epis/epis.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly companiesService: CompaniesService,
    private readonly episService: EpisService,
  ) {}

  async create(companyId: number, createRoleDto: CreateRoleDto) {
    const company = await this.companiesService.findOne(companyId);

    const epis = await this.episService.findByIds(createRoleDto.epis);

    const role = this.roleRepository.create({
      ...createRoleDto,
      empresa: company,
      epis,
    });

    await this.roleRepository.save(role);

    return role.id;
  }

  async findAll(companyId: number) {
    await this.companiesService.findOne(companyId);

    const roles = await this.roleRepository.find({
      where: {
        empresa: { id: companyId },
        status: 'A',
      },
      relations: ['epis'],
    });

    return plainToInstance(RoleResponseDto, roles);
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: {
        id,
        status: 'A',
      },
      relations: ['epis'],
    });

    if (!role) {
      throw new NotFoundException('Função não encontrada.');
    }

    return plainToInstance(RoleResponseDto, role);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const epis = await this.episService.findByIds(updateRoleDto.epis);

    const result = await this.roleRepository.update(id, {
      ...updateRoleDto,
      epis,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Função não encontrada.');
    }

    return `A função #${id} foi atualizada.`;
  }

  async remove(id: number, deleteRoleDto: BaseDeleteDto) {
    const result = await this.roleRepository.update(id, {
      status: 'E',
      atualizadoPor: deleteRoleDto.excluidoPor,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Função não encontrada.');
    }

    return `A função #${id} foi excluída.`;
  }
}
