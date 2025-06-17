import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { DataSource, Repository } from 'typeorm';
import { CompaniesService } from '../companies/companies.service';
import { plainToInstance } from 'class-transformer';
import { RoleEpiResponseDto, RoleResponseDto } from './dto/role-response.dto';
import { EpisService } from '../epis/epis.service';
import { RoleEpiAction, RoleEpiLogs } from './entities/role-epi-logs.entity';
import { UsersService } from '../users/users.service';
import { Epi } from '../epis/entities/epi.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
    private readonly episService: EpisService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    companyId: string,
    createRoleDto: CreateRoleDto,
    createdBy: string,
  ) {
    const company = await this.companiesService.findOne(companyId);

    const user = await this.usersService.findOne(createdBy);

    let epis: Epi[];

    if (createRoleDto.epis && createRoleDto.epis.length > 0) {
      epis = await this.episService.findByIds(createRoleDto.epis);
    }

    const role = this.roleRepository.create({
      ...createRoleDto,
      empresa: { id: company.id },
      criadoPor: user,
      epis,
    });

    await this.roleRepository.save(role);

    return plainToInstance(
      RoleResponseDto,
      {
        ...role,
        epis: plainToInstance(RoleEpiResponseDto, role.epis, {
          excludeExtraneousValues: true,
        }),
      },
      { excludeExtraneousValues: true },
    );
  }

  async findAll(companyId: string) {
    const company = await this.companiesService.findOne(companyId);

    const roles = await this.roleRepository.find({
      where: {
        empresa: { id: company.id },
        status: 'A',
      },
      relations: ['epis'],
    });

    const rolesWithTransformedEpis = roles.map((role) => ({
      ...role,
      epis: plainToInstance(RoleEpiResponseDto, role.epis, {
        excludeExtraneousValues: true,
      }),
    }));

    return plainToInstance(RoleResponseDto, rolesWithTransformedEpis, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
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

    return plainToInstance(
      RoleResponseDto,
      {
        ...role,
        epis: plainToInstance(RoleEpiResponseDto, role.epis, {
          excludeExtraneousValues: true,
        }),
      },
      { excludeExtraneousValues: true },
    );
  }

  async findOneInternal(id: string) {
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
    });

    if (!role) {
      throw new NotFoundException('Função não encontrada.');
    }

    return role;
  }

  async findById(id: string) {
    const role = await this.roleRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!role) {
      throw new NotFoundException('Função não encontrada.');
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, updatedBy: string) {
    const user = await this.usersService.findById(updatedBy);

    const role = await this.roleRepository.findOne({
      where: { id, status: 'A' },
      relations: ['epis'],
    });

    if (!role) {
      throw new NotFoundException('Função não encontrada.');
    }

    let newEpis = role.epis;
    if (updateRoleDto.epis) {
      newEpis = await this.episService.findByIds(updateRoleDto.epis);
    }

    const removedEpis = role.epis.filter(
      (epi) => !newEpis.some((newEpi) => newEpi.id === epi.id),
    );

    if (role.nome === updateRoleDto.nome && removedEpis.length === 0) {
      throw new BadRequestException(
        `Nenhuma alteração foi feita na função #${id}.`,
      );
    }

    await this.dataSource.transaction(async (manager) => {
      if (updateRoleDto.nome) {
        role.nome = updateRoleDto.nome;
      }

      if (updateRoleDto.epis) {
        role.epis = newEpis;
      }

      role.atualizadoPor = user;

      await manager.save(role);

      if (removedEpis.length > 0) {
        const logs = removedEpis.map((epi) => ({
          funcao: role,
          epi: epi,
          acao: RoleEpiAction.REMOVEU,
          descricao: `O usuário ${user.id} removeu o EPI ${epi.id} da função ${role.id}.`,
          criadoPor: user.id,
        }));
        await manager.save(RoleEpiLogs, logs);
      }
    });

    const updatedRole = await this.findOne(id);

    return updatedRole;
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.roleRepository.update(
      { id, status: 'A' },
      {
        status: 'E',
        atualizadoPor: user,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Função já excluída ou não encontrada.');
    }

    const removedRole = await this.roleRepository.findOne({
      where: { id },
      relations: ['epis'],
    });

    return plainToInstance(
      RoleResponseDto,
      {
        ...removedRole,
        epis: plainToInstance(RoleEpiResponseDto, removedRole.epis, {
          excludeExtraneousValues: true,
        }),
      },
      { excludeExtraneousValues: true },
    );
  }
}
