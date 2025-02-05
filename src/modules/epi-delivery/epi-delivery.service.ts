import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEpiDeliveryDto } from './dto/create-epi-delivery.dto';
import { UpdateEpiDeliveryDto } from './dto/update-epi-delivery.dto';
import { EpiDelivery } from './entities/epi-delivery.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EmployeesService } from '../employees/employees.service';
import { EpisService } from '../epis/epis.service';
import { plainToInstance } from 'class-transformer';
import { EpiDeliveryResponseDto } from './dto/epi-delivery-response.dto';
import { BaseDeleteDto } from 'src/common/utils/dto/base-delete.dto';
import {
  EpiDeliveryAction,
  EpiDeliveryLogs,
} from './entities/delivery-epi-logs.entity';

@Injectable()
export class EpiDeliveryService {
  constructor(
    @InjectRepository(EpiDelivery)
    private readonly epiDeliveryRepository: Repository<EpiDelivery>,
    private readonly employeesService: EmployeesService,
    private readonly episService: EpisService,
    private readonly dataSource: DataSource,
  ) {}

  async create(employeeId: number, createEpiDeliveryDto: CreateEpiDeliveryDto) {
    const employee = await this.employeesService.findOne(employeeId);

    const epis = await this.episService.findByIds(createEpiDeliveryDto.epis);

    const epiDelivery = this.epiDeliveryRepository.create({
      ...createEpiDeliveryDto,
      funcionario: employee,
      epis,
    });

    await this.epiDeliveryRepository.save(epiDelivery);

    return epiDelivery.id;
  }

  async findAll(employeeId: number) {
    await this.employeesService.findOne(employeeId);

    const epiDeliveries = await this.epiDeliveryRepository.find({
      where: {
        funcionario: { id: employeeId },
        status: 'A',
      },
      relations: ['epis'],
    });

    return plainToInstance(EpiDeliveryResponseDto, epiDeliveries);
  }

  async findOne(id: number) {
    const epiDelivery = await this.epiDeliveryRepository.findOne({
      where: {
        id,
        status: 'A',
      },
      relations: ['epis'],
    });

    return plainToInstance(EpiDeliveryResponseDto, epiDelivery);
  }

  async update(id: number, updateEpiDeliveryDto: UpdateEpiDeliveryDto) {
    const epiDelivery = await this.epiDeliveryRepository.findOne({
      where: { id, status: 'A' },
      relations: ['epis'],
    });

    if (!epiDelivery) {
      throw new NotFoundException('Entrega de Epi(s) não encontrada');
    }

    let newEpis = epiDelivery.epis;
    if (updateEpiDeliveryDto.epis) {
      newEpis = await this.episService.findByIds(updateEpiDeliveryDto.epis);
    }

    const removedEpis = epiDelivery.epis.filter(
      (epi) => !newEpis.some((newEpi) => newEpi.id === epi.id),
    );

    await this.dataSource.transaction(async (manager) => {
      if (updateEpiDeliveryDto.data) {
        epiDelivery.data = new Date(updateEpiDeliveryDto.data);
      }

      if (updateEpiDeliveryDto.motivo) {
        epiDelivery.motivo = updateEpiDeliveryDto.motivo;
      }

      if (updateEpiDeliveryDto.entreguePor) {
        epiDelivery.entreguePor = updateEpiDeliveryDto.entreguePor;
      }

      await manager.save(epiDelivery);

      if (removedEpis.length > 0) {
        const logs = removedEpis.map((epi) => ({
          epiDelivery: epiDelivery,
          epi: epi,
          acao: EpiDeliveryAction.REMOVEU,
          descricao: `O usuário ${updateEpiDeliveryDto.atualizadoPor} removeu o Epi ${epi.id} da entrega ${epiDelivery.id}.`,
          criadoPor: updateEpiDeliveryDto.atualizadoPor,
        }));
        await manager.insert(EpiDeliveryLogs, logs);
      }
    });

    return `A entrega de Epi(s) #${id} foi atualizado.`;
  }

  async remove(id: number, deleteEpiDeliveryDto: BaseDeleteDto) {
    const result = await this.epiDeliveryRepository.update(id, {
      status: 'E',
      atualizadoPor: deleteEpiDeliveryDto.excluidoPor,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Entrega de Epi(s) não encontrada.');
    }

    return `A entrega de Epi(s) #${id} foi excluído.`;
  }
}
