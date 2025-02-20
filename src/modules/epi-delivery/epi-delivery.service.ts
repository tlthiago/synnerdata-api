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
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';
import {
  EpiDeliveryAction,
  EpiDeliveryLogs,
} from './entities/delivery-epi-logs.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class EpiDeliveryService {
  constructor(
    @InjectRepository(EpiDelivery)
    private readonly epiDeliveryRepository: Repository<EpiDelivery>,
    private readonly employeesService: EmployeesService,
    private readonly episService: EpisService,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async create(employeeId: number, createEpiDeliveryDto: CreateEpiDeliveryDto) {
    const employee = await this.employeesService.findOne(employeeId);

    const epis = await this.episService.findByIds(createEpiDeliveryDto.epis);

    const user = await this.usersService.findOne(
      createEpiDeliveryDto.criadoPor,
    );

    const epiDelivery = this.epiDeliveryRepository.create({
      ...createEpiDeliveryDto,
      epis,
      funcionario: employee,
      criadoPor: user,
    });

    await this.epiDeliveryRepository.save(epiDelivery);

    return epiDelivery.id;
  }

  async findAll(employeeId: number) {
    const employee = await this.employeesService.findOne(employeeId);

    const epiDeliveries = await this.epiDeliveryRepository.find({
      where: {
        funcionario: { id: employee.id },
        status: 'A',
      },
      relations: ['epis'],
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

  async findOne(id: number) {
    const epiDelivery = await this.epiDeliveryRepository.findOne({
      where: {
        id,
        status: 'A',
      },
      relations: ['epis'],
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

  async update(id: number, updateEpiDeliveryDto: UpdateEpiDeliveryDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const epiDelivery = await this.epiDeliveryRepository.findOne({
        where: { id, status: 'A' },
        relations: ['epis'],
      });

      if (!epiDelivery) {
        throw new NotFoundException('Entrega de Epi(s) não encontrada.');
      }

      const user = await this.usersService.findById(
        updateEpiDeliveryDto.atualizadoPor,
      );

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
          descricao: `O usuário ${updateEpiDeliveryDto.atualizadoPor} removeu o Epi ${epi.id} da entrega ${epiDelivery.id}.`,
          criadoPor: updateEpiDeliveryDto.atualizadoPor,
        }));
        await queryRunner.manager.save(EpiDeliveryLogs, logs);
      }

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number, deleteEpiDeliveryDto: BaseDeleteDto) {
    const user = await this.usersService.findOne(
      deleteEpiDeliveryDto.excluidoPor,
    );

    const result = await this.epiDeliveryRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Entrega de Epi(s) não encontrada.');
    }

    return { id, status: 'E' };
  }
}
