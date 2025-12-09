import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { EpiDelivery } from '../../../modules/epi-delivery/entities/epi-delivery.entity';
import {
  MOTIVOS_ENTREGA_EPI,
  getRandomElement,
} from '../seeds/helpers/brazilian-data.helper';

export const EpiDeliveryFactory = setSeederFactory(EpiDelivery, () => {
  const epiDelivery = new EpiDelivery();

  epiDelivery.data = faker.date.past({ years: 2 });
  epiDelivery.motivo = getRandomElement(MOTIVOS_ENTREGA_EPI);
  epiDelivery.entreguePor = faker.person.fullName();
  epiDelivery.status = 'A';

  return epiDelivery;
});
