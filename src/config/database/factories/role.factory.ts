import { setSeederFactory } from 'typeorm-extension';
import { Role } from '../../../modules/roles/entities/role.entity';
import {
  CARGOS_COMUNS,
  getRandomElement,
} from '../seeds/helpers/brazilian-data.helper';

export const RoleFactory = setSeederFactory(Role, () => {
  const role = new Role();

  role.nome = getRandomElement(CARGOS_COMUNS);
  role.status = 'A';

  return role;
});
