import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Branch } from '../../../modules/branches/entities/branch.entity';
import { generateValidCnpj } from '../seeds/helpers/cnpj.helper';
import {
  ESTADOS_BRASILEIROS,
  CIDADES_POR_ESTADO,
  getRandomElement,
} from '../seeds/helpers/brazilian-data.helper';

export const BranchFactory = setSeederFactory(Branch, () => {
  const branch = new Branch();

  const estado = getRandomElement(ESTADOS_BRASILEIROS);
  const cidades = CIDADES_POR_ESTADO[estado] || ['Capital'];
  const cidade = getRandomElement(cidades);

  branch.nome = `Filial ${cidade}`;
  branch.cnpj = generateValidCnpj();
  branch.rua = faker.location.street();
  branch.numero = faker.location.buildingNumber();
  branch.complemento =
    faker.helpers.maybe(() => faker.location.secondaryAddress()) || undefined;
  branch.bairro = faker.location.county();
  branch.cidade = cidade;
  branch.estado = estado;
  branch.cep = faker.string.numeric(8);
  branch.dataFundacao = faker.date.past({ years: 10 });
  branch.telefone = faker.string.numeric({
    length: 10,
    allowLeadingZeros: true,
  });
  branch.celular = faker.string.numeric({
    length: 11,
    allowLeadingZeros: true,
  });
  branch.status = 'A';

  return branch;
});
