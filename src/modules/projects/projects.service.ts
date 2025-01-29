import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { CompaniesService } from '../companies/companies.service';
import { plainToInstance } from 'class-transformer';
import { ProjectResponseDto } from './dto/project-response.dto';
import { BaseDeleteDto } from 'src/common/utils/dto/base-delete.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(companyId: number, createProjectDto: CreateProjectDto) {
    const company = await this.companiesService.findOne(companyId);

    const project = this.projectRepository.create({
      ...createProjectDto,
      empresa: company,
    });

    await this.projectRepository.save(project);

    return project.id;
  }

  async findAll(companyId: number) {
    await this.companiesService.findOne(companyId);

    const projects = await this.projectRepository.find({
      where: {
        empresa: { id: companyId },
        status: 'A',
      },
    });

    return plainToInstance(ProjectResponseDto, projects);
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    return plainToInstance(ProjectResponseDto, project);
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const result = await this.projectRepository.update(id, {
      ...updateProjectDto,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    return `O projeto #${id} foi atualizado.`;
  }

  async remove(id: number, deleteProjectDto: BaseDeleteDto) {
    const result = await this.projectRepository.update(id, {
      status: 'E',
      atualizadoPor: deleteProjectDto.excluidoPor,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    return `O projeto #${id} foi excluído.`;
  }
}
