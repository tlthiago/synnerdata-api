import { setSeederFactory } from 'typeorm-extension';
import { Epi } from '../../../modules/epis/entities/epi.entity';
import {
  EPIS_COMUNS,
  getRandomElement,
} from '../seeds/helpers/brazilian-data.helper';

export const EpiFactory = setSeederFactory(Epi, () => {
  const epi = new Epi();

  const epiData = getRandomElement(EPIS_COMUNS);
  epi.nome = epiData.nome;
  epi.descricao = epiData.descricao;
  epi.equipamentos = epiData.equipamentos;
  epi.status = 'A';

  return epi;
});
