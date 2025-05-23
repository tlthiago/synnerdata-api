import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { CompaniesService } from '../companies/companies.service';
import { plainToInstance } from 'class-transformer';
import { ProjectResponseDto } from './dto/project-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    companyId: string,
    createProjectDto: CreateProjectDto,
    createdBy: string,
  ) {
    const company = await this.companiesService.findOne(companyId);

    const user = await this.usersService.findOne(createdBy);

    const project = this.projectRepository.create({
      ...createProjectDto,
      empresa: { id: company.id },
      criadoPor: user,
    });

    await this.projectRepository.save(project);

    return plainToInstance(ProjectResponseDto, project, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(companyId: string) {
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

  async findOne(id: string) {
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

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    updatedBy: string,
  ) {
    const user = await this.usersService.findOne(updatedBy);

    const result = await this.projectRepository.update(id, {
      ...updateProjectDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    const updatedProject = await this.findOne(id);

    return updatedProject;
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.projectRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Projeto já excluído ou não encontrado.');
    }

    const removedProject = await this.projectRepository.findOne({
      where: { id },
    });

    return plainToInstance(ProjectResponseDto, removedProject, {
      excludeExtraneousValues: true,
    });
  }
}
