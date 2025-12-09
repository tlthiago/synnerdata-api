import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { User, Funcao } from '../../../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export const UserFactory = setSeederFactory(User, () => {
  const user = new User();

  user.nome = faker.person.fullName();
  user.email = faker.internet.email().toLowerCase();
  user.senha = bcrypt.hashSync('Seed@123', 10);
  user.funcao = faker.helpers.arrayElement([
    Funcao.ADMIN,
    Funcao.GESTOR1,
    Funcao.GESTOR2,
    Funcao.VISUALIZADOR,
  ]);
  user.primeiroAcesso = false;
  user.status = 'A';

  return user;
});
