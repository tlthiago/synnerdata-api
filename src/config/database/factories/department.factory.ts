import { setSeederFactory } from 'typeorm-extension';
import { Department } from '../../../modules/departments/entities/department.entity';
import {
  SETORES_COMUNS,
  getRandomElement,
} from '../seeds/helpers/brazilian-data.helper';

export const DepartmentFactory = setSeederFactory(Department, () => {
  const department = new Department();

  department.nome = getRandomElement(SETORES_COMUNS);
  department.status = 'A';

  return department;
});
