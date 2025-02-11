import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { CompaniesService } from '../companies/companies.service';
import { plainToInstance } from 'class-transformer';
import { ProjectResponseDto } from './dto/project-response.dto';
import { BaseDeleteDto } from '../../common/utils/dto/base-delete.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
  ) {}

  async create(companyId: number, createProjectDto: CreateProjectDto) {
    const company = await this.companiesService.findOne(companyId);

    const user = await this.usersService.findOne(createProjectDto.criadoPor);

    const project = this.projectRepository.create({
      ...createProjectDto,
      empresa: company,
      criadoPor: user,
    });

    await this.projectRepository.save(project);

    return project.id;
  }

  async findAll(companyId: number) {
    const company = await this.companiesService.findOne(companyId);

    const projects = await this.projectRepository.find({
      where: {
        empresa: { id: company.id },
        status: 'A',
      },
    });

    return plainToInstance(ProjectResponseDto, projects, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    return plainToInstance(ProjectResponseDto, project, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const user = await this.usersService.findOne(
      updateProjectDto.atualizadoPor,
    );

    const result = await this.projectRepository.update(id, {
      ...updateProjectDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    return this.findOne(id);
  }

  async remove(id: number, deleteProjectDto: BaseDeleteDto) {
    const user = await this.usersService.findOne(deleteProjectDto.excluidoPor);

    const result = await this.projectRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    return { id, status: 'E' };
  }
}
