import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Promotion } from '../../../modules/promotion/entities/promotion.entity';

export const PromotionFactory = setSeederFactory(Promotion, () => {
  const promotion = new Promotion();

  promotion.salario = parseFloat(
    faker.finance.amount({ min: 2000, max: 20000, dec: 2 }),
  );
  promotion.data = faker.date.past({ years: 3 });
  promotion.status = 'A';

  return promotion;
});
