import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Warning } from '../../../modules/warnings/entities/warning.entity';
import {
  MOTIVOS_ADVERTENCIA,
  getRandomElement,
} from '../seeds/helpers/brazilian-data.helper';

export const WarningFactory = setSeederFactory(Warning, () => {
  const warning = new Warning();

  warning.data = faker.date.past({ years: 2 });
  warning.motivo = getRandomElement(MOTIVOS_ADVERTENCIA);
  warning.status = 'A';

  return warning;
});
