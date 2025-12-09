import { setSeederFactory } from 'typeorm-extension';
import { Cbo } from '../../../modules/cbos/entities/cbo.entity';
import {
  CBOS_COMUNS,
  getRandomElement,
} from '../seeds/helpers/brazilian-data.helper';

export const CboFactory = setSeederFactory(Cbo, () => {
  const cbo = new Cbo();

  cbo.nome = getRandomElement(CBOS_COMUNS);
  cbo.status = 'A';

  return cbo;
});
