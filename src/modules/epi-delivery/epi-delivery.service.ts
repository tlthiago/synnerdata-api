import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEpiDeliveryDto } from './dto/create-epi-delivery.dto';
import { UpdateEpiDeliveryDto } from './dto/update-epi-delivery.dto';
import { EpiDelivery } from './entities/epi-delivery.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { EpisService } from '../epis/epis.service';
import { plainToInstance } from 'class-transformer';
import {
  EpiDeliveryResponseDto,
  EpisResponseDto,
} from './dto/epi-delivery-response.dto';
import {
  EpiDeliveryAction,
  EpiDeliveryLogs,
} from './entities/delivery-epi-logs.entity';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class EpiDeliveryService {
  constructor(
    @InjectRepository(EpiDelivery)
    private readonly epiDeliveryRepository: Repository<EpiDelivery>,
    private readonly employeesService: EmployeesService,
    private readonly episService: EpisService,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    employeeId: string,
    createEpiDeliveryDto: CreateEpiDeliveryDto,
    createdBy: string,
  ) {
    const employee = await this.employeesService.findOne(employeeId);

    const epis = await this.episService.findByIds(createEpiDeliveryDto.epis);

    const user = await this.usersService.findOne(createdBy);

    const epiDelivery = this.epiDeliveryRepository.create({
      ...createEpiDeliveryDto,
      epis,
      funcionario: { id: employee.id },
      criadoPor: user,
    });

    await this.epiDeliveryRepository.save(epiDelivery);

    return await this.findOne(epiDelivery.id);
  }

  async findAllByCompany(companyId: string) {
    const company = await this.companiesService.findById(companyId);

    const epiDeliveries = await this.epiDeliveryRepository
      .createQueryBuilder('entregas_de_epis')
      .innerJoinAndSelect('entregas_de_epis.epis', 'epis')
      .innerJoinAndSelect('entregas_de_epis.funcionario', 'funcionario')
      .innerJoinAndSelect('entregas_de_epis.criadoPor', 'criadoPor')
      .leftJoinAndSelect('entregas_de_epis.atualizadoPor', 'atualizadoPor')
      .innerJoin('funcionario.empresa', 'empresa')
      .where('empresa.id = :companyId', { companyId: company.id })
      .andWhere('entregas_de_epis.status = :status', { status: 'A' })
      .getMany();

    return plainToInstance(EpiDeliveryResponseDto, epiDeliveries, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(employeeId: string) {
    const employee = await this.employeesService.findOne(employeeId);

    const epiDeliveries = await this.epiDeliveryRepository.find({
      where: {
        funcionario: { id: employee.id },
        status: 'A',
      },
      relations: ['epis', 'funcionario'],
    });

    const epiDeliveriesWithTransformedEpis = epiDeliveries.map(
      (epiDelivery) => ({
        ...epiDelivery,
        epis: plainToInstance(EpisResponseDto, epiDelivery.epis, {
          excludeExtraneousValues: true,
        }),
      }),
    );

    return plainToInstance(
      EpiDeliveryResponseDto,
      epiDeliveriesWithTransformedEpis,
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async findOne(id: string) {
    const epiDelivery = await this.epiDeliveryRepository.findOne({
      where: {
        id,
        status: 'A',
      },
      relations: ['epis', 'funcionario'],
    });

    if (!epiDelivery) {
      throw new NotFoundException('Entrega de Epi(s) não encontrada.');
    }

    return plainToInstance(
      EpiDeliveryResponseDto,
      {
        ...epiDelivery,
        epis: plainToInstance(EpisResponseDto, epiDelivery.epis, {
          excludeExtraneousValues: true,
        }),
      },
      { excludeExtraneousValues: true },
    );
  }

  async update(
    id: string,
    updateEpiDeliveryDto: UpdateEpiDeliveryDto,
    updatedBy: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const epiDelivery = await this.epiDeliveryRepository.findOne({
        where: { id, status: 'A' },
        relations: ['epis', 'funcionario'],
      });

      if (!epiDelivery) {
        throw new NotFoundException('Entrega de Epi(s) não encontrada.');
      }

      const user = await this.usersService.findById(updatedBy);

      let newEpis = epiDelivery.epis;
      if (updateEpiDeliveryDto.epis) {
        newEpis = await this.episService.findByIds(updateEpiDeliveryDto.epis);
      }

      const addedEpis = newEpis.filter(
        (newEpi) => !epiDelivery.epis.some((epi) => epi.id === newEpi.id),
      );

      const removedEpis = epiDelivery.epis.filter(
        (epi) => !newEpis.some((newEpi) => newEpi.id === epi.id),
      );

      if (updateEpiDeliveryDto.data) {
        epiDelivery.data = new Date(updateEpiDeliveryDto.data);
      }

      if (updateEpiDeliveryDto.motivo) {
        epiDelivery.motivo = updateEpiDeliveryDto.motivo;
      }

      if (updateEpiDeliveryDto.entreguePor) {
        epiDelivery.entreguePor = updateEpiDeliveryDto.entreguePor;
      }

      epiDelivery.epis = addedEpis;
      epiDelivery.atualizadoPor = user;
      await queryRunner.manager.save(epiDelivery);

      if (removedEpis.length > 0) {
        const logs = removedEpis.map((epi) => ({
          entregaDeEpi: epiDelivery,
          epi: epi,
          acao: EpiDeliveryAction.REMOVEU,
          descricao: `O usuário ${user.id} removeu o Epi ${epi.id} da entrega ${epiDelivery.id}.`,
          criadoPor: user.id,
        }));
        await queryRunner.manager.save(EpiDeliveryLogs, logs);
      }

      await queryRunner.commitTransaction();

      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.epiDeliveryRepository.update(
      { id, status: 'A' },
      {
        status: 'E',
        atualizadoPor: user,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException(
        'Entrega de Epi(s) já excluída(s) ou não encontrada(s).',
      );
    }

    const removedEpiDelivery = await this.epiDeliveryRepository.findOne({
      where: { id },
      relations: ['epis', 'funcionario'],
    });

    return plainToInstance(
      EpiDeliveryResponseDto,
      {
        ...removedEpiDelivery,
        epis: plainToInstance(EpisResponseDto, removedEpiDelivery.epis, {
          excludeExtraneousValues: true,
        }),
      },
      { excludeExtraneousValues: true },
    );
  }
}
