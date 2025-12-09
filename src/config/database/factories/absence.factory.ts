import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Absence } from '../../../modules/absence/entities/absence.entity';
import {
  MOTIVOS_FALTA,
  getRandomElement,
} from '../seeds/helpers/brazilian-data.helper';

export const AbsenceFactory = setSeederFactory(Absence, () => {
  const absence = new Absence();

  absence.data = faker.date.past({ years: 2 });
  absence.motivo = getRandomElement(MOTIVOS_FALTA);
  absence.status = 'A';

  return absence;
});
