import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Project } from '../../../modules/projects/entities/project.entity';

export const ProjectFactory = setSeederFactory(Project, () => {
  const project = new Project();

  project.nome = `Projeto ${faker.company.buzzNoun()} ${faker.location.city()}`;
  project.descricao = faker.lorem.sentence();
  project.dataInicio = faker.date.past({ years: 2 });
  project.cno = faker.string.numeric(12);
  project.status = 'A';

  return project;
});
