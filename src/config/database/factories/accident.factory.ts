import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Accident } from '../../../modules/accidents/entities/accident.entity';
import {
  NATUREZAS_ACIDENTE,
  MEDIDAS_ACIDENTE,
  getRandomElement,
  getRandomBoolean,
} from '../seeds/helpers/brazilian-data.helper';

export const AccidentFactory = setSeederFactory(Accident, () => {
  const accident = new Accident();

  accident.descricao = faker.lorem.sentence();
  accident.data = faker.date.past({ years: 2 });
  accident.natureza = getRandomElement(NATUREZAS_ACIDENTE);
  accident.cat = getRandomBoolean(0.6) ? faker.string.numeric(20) : undefined;
  accident.medidasTomadas = getRandomElement(MEDIDAS_ACIDENTE);
  accident.status = 'A';

  return accident;
});
